import React, { useEffect, useRef } from 'react';

interface SnowAndMistCanvasProps {
  snowIntensity: 'gentle' | 'moderate' | 'blizzard' | 'off';
  mistEnabled: boolean;
  spectralMotionEnabled: boolean;
}

interface Snowflake {
  x: number;
  y: number;
  baseRadius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  swayOffset: number;
  swaySpeed: number;
  layer: 0 | 1 | 2; // 0: distant fine, 1: mid soft flake, 2: foreground soft bokeh
  densityThreshold: number; // 0..1 determines when this flake appears during thicker waves
  visibility: number; // smoothly fades 0..1 as density breathes
}

export const SnowAndMistCanvas: React.FC<SnowAndMistCanvasProps> = ({
  snowIntensity,
  mistEnabled,
  spectralMotionEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Pre-allocated peak pool so density can breathe smoothly from sparse to lush with zero GC
    const maxPoolMap = {
      off: 0,
      gentle: 135,
      moderate: 235,
      blizzard: 320,
    };

    const poolSize = maxPoolMap[snowIntensity];
    const flakes: Snowflake[] = Array.from({ length: poolSize }, (_, idx) => {
      const layerRand = Math.random();
      const layer: 0 | 1 | 2 = layerRand > 0.86 ? 2 : layerRand > 0.4 ? 1 : 0;
      const densityThreshold = Math.min(
        1,
        Math.max(0, (idx + Math.random()) / Math.max(1, poolSize))
      );
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseRadius:
          layer === 2
            ? Math.random() * 2.8 + 2.2
            : layer === 1
            ? Math.random() * 1.6 + 1.0
            : Math.random() * 1.0 + 0.4,
        speedY:
          layer === 2
            ? Math.random() * 0.9 + 0.65
            : layer === 1
            ? Math.random() * 0.55 + 0.35
            : Math.random() * 0.3 + 0.15,
        speedX: (Math.random() - 0.5) * 0.35,
        opacity:
          layer === 2
            ? Math.random() * 0.28 + 0.15
            : layer === 1
            ? Math.random() * 0.48 + 0.25
            : Math.random() * 0.35 + 0.12,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.015 + 0.004,
        layer,
        densityThreshold,
        visibility: densityThreshold <= 0.7 ? 1 : 0,
      };
    });

    // Cached offscreen bokeh snowflake sprite for delicate foreground flakes
    const bokehSprite = document.createElement('canvas');
    bokehSprite.width = 32;
    bokehSprite.height = 32;
    const bCtx = bokehSprite.getContext('2d');
    if (bCtx) {
      const grad = bCtx.createRadialGradient(16, 16, 1, 16, 16, 16);
      grad.addColorStop(0, 'rgba(235, 236, 240, 1)');
      grad.addColorStop(0.5, 'rgba(200, 202, 210, 0.45)');
      grad.addColorStop(1, 'rgba(200, 202, 210, 0)');
      bCtx.fillStyle = grad;
      bCtx.fillRect(0, 0, 32, 32);
    }

    // Organic dynamic weather state: randomly alternates between calm sparse slow drifts & thick swift flurries
    let currentDensity = 0.72;
    let targetDensity = 0.85;
    let currentSpeed = 1.05;
    let targetSpeed = 1.25;
    let currentWind = 0.15;
    let targetWind = 0.35;
    let lastMoodIdx = 1;
    let nextMoodTick = 260; // ~4.3s after mount before shifting mood

    const pickNextWeatherMood = () => {
      // 3 distinct poetic winter moods so every transition feels alive & non-repetitive
      // 0: Sparse, hushed slow-motion drift
      // 1: Balanced dreamy winter snowfall
      // 2: Thick, brisk wind-swept flurry
      let mood = Math.floor(Math.random() * 3);
      if (mood === lastMoodIdx) {
        mood = (mood + 1 + Math.floor(Math.random() * 2)) % 3;
      }
      lastMoodIdx = mood;

      const windDir = Math.random() > 0.45 ? 1 : -1;

      if (mood === 0) {
        // Thưa & rơi chậm thanh bình
        targetDensity = 0.34 + Math.random() * 0.18;
        targetSpeed = 0.55 + Math.random() * 0.25;
        targetWind = windDir * (0.05 + Math.random() * 0.22);
        nextMoodTick = tick + 340 + Math.floor(Math.random() * 260); // ~5.5–10s
      } else if (mood === 1) {
        // Vừa phải, lất phất tự nhiên
        targetDensity = 0.62 + Math.random() * 0.2;
        targetSpeed = 0.95 + Math.random() * 0.4;
        targetWind = windDir * (0.2 + Math.random() * 0.45);
        nextMoodTick = tick + 360 + Math.floor(Math.random() * 280); // ~6–10.5s
      } else {
        // Đợt tuyết dày & gió lùa rơi nhanh hơn
        targetDensity = 0.88 + Math.random() * 0.12;
        targetSpeed = 1.55 + Math.random() * 0.65;
        targetWind = windDir * (0.6 + Math.random() * 0.85);
        nextMoodTick = tick + 300 + Math.floor(Math.random() * 260); // ~5–9.3s
      }
    };

    let tick = 0;

    const render = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      tick += 1;

      if (tick >= nextMoodTick) {
        pickNextWeatherMood();
      }

      // Smooth organic easing toward target weather mood
      currentDensity += (targetDensity - currentDensity) * 0.0085;
      currentSpeed += (targetSpeed - currentSpeed) * 0.009;
      currentWind += (targetWind - currentWind) * 0.008;

      // Subtle continuous breathing gust layered on top of weather mood
      const gustWave = Math.sin(tick * 0.009) * 0.28 + Math.sin(tick * 0.021) * 0.14;
      const blizzardBoost = snowIntensity === 'blizzard' ? 1.45 : 1;

      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric lantern glow around cursor if spectral motion enabled
      if (spectralMotionEnabled && mouseRef.current.active) {
        ctx.globalAlpha = 1;
        const grad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          10,
          mouseRef.current.x,
          mouseRef.current.y,
          280
        );
        grad.addColorStop(0, 'rgba(212, 212, 220, 0.045)');
        grad.addColorStop(0.5, 'rgba(161, 161, 170, 0.018)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.fillStyle = '#e4e4ea';

      // Draw fine snowflakes with cached bokeh sprite & organic weather waves
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        const shouldBeActive = f.densityThreshold <= currentDensity;

        if (shouldBeActive) {
          if (f.visibility < 1) {
            if (f.visibility === 0) {
              f.y = -Math.random() * height * 0.25 - 12;
              f.x = Math.random() * width;
            }
            f.visibility = Math.min(1, f.visibility + 0.014);
          }
        } else if (f.visibility > 0) {
          f.visibility = Math.max(0, f.visibility - 0.012);
        }

        if (f.visibility <= 0.01) continue;

        f.swayOffset += f.swaySpeed * (0.75 + currentSpeed * 0.35);
        const layerDepthFactor = f.layer === 2 ? 1.2 : f.layer === 1 ? 0.95 : 0.6;
        const swayX = Math.sin(f.swayOffset) * (0.35 * layerDepthFactor);
        const windX = (currentWind + gustWave) * layerDepthFactor;

        f.y += f.speedY * currentSpeed * blizzardBoost;
        f.x += f.speedX + swayX + windX;

        if (f.y > height + 14) {
          f.y = -12;
          f.x = Math.random() * width;
        }
        if (f.x > width + 14) f.x = -12;
        if (f.x < -14) f.x = width + 12;

        ctx.globalAlpha = f.opacity * f.visibility;
        if (f.layer === 2) {
          const size = f.baseRadius * 4.2;
          ctx.drawImage(bokehSprite, f.x - size * 0.5, f.y - size * 0.5, size, size);
        } else {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.baseRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [snowIntensity, spectralMotionEnabled]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      style={{ transform: 'translateZ(0)' }}
      aria-hidden="true"
    >
      {/* Subtle neutral monochrome mist that never shifts the #101010 background */}
      {mistEnabled && (
        <>
          <div
            className="animate-mist-slow absolute -inset-x-24 top-[6%] h-[360px] rounded-full opacity-15 blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(210, 210, 210, 0.07) 0%, rgba(120, 120, 120, 0.03) 50%, transparent 75%)',
            }}
          />
          <div
            className="animate-mist-reverse absolute -inset-x-32 bottom-[4%] h-[380px] rounded-full opacity-15 blur-3xl"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(200, 200, 200, 0.06) 0%, rgba(100, 100, 100, 0.025) 55%, transparent 78%)',
            }}
          />
        </>
      )}

      {/* Snowfall & Ash Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};
