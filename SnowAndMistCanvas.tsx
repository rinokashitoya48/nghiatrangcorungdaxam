import React, { useEffect, useRef } from 'react';

interface SnowAndMistCanvasProps {
  snowIntensity: 'gentle' | 'moderate' | 'blizzard' | 'off';
  mistEnabled: boolean;
  spectralMotionEnabled: boolean;
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  swayOffset: number;
  swaySpeed: number;
  layer: 0 | 1 | 2; // 0: distant fine, 1: mid, 2: foreground soft bokeh
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

    const countMap = {
      off: 0,
      gentle: 75,
      moderate: 155,
      blizzard: 260,
    };

    const targetCount = countMap[snowIntensity];
    const flakes: Snowflake[] = Array.from({ length: targetCount }, () => {
      const layerRand = Math.random();
      const layer: 0 | 1 | 2 = layerRand > 0.86 ? 2 : layerRand > 0.4 ? 1 : 0;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius:
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
      };
    });

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric lantern glow around cursor if spectral motion enabled
      if (spectralMotionEnabled && mouseRef.current.active) {
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

      // Draw snowflakes with depth-of-field softness
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.swayOffset += f.swaySpeed;
        const windX =
          snowIntensity === 'blizzard'
            ? Math.sin(tick * 0.005) * 0.7 + 0.45
            : Math.sin(f.swayOffset) * 0.35;

        f.y += f.speedY * (snowIntensity === 'blizzard' ? 1.55 : 1);
        f.x += f.speedX + windX;

        if (f.y > height + 12) {
          f.y = -10;
          f.x = Math.random() * width;
        }
        if (f.x > width + 12) f.x = -10;
        if (f.x < -12) f.x = width + 10;

        ctx.beginPath();
        if (f.layer === 2) {
          // Soft bokeh foreground snow/ash
          const radial = ctx.createRadialGradient(
            f.x,
            f.y,
            0.2,
            f.x,
            f.y,
            f.radius * 2.1
          );
          radial.addColorStop(0, `rgba(235, 236, 240, ${f.opacity})`);
          radial.addColorStop(0.5, `rgba(200, 202, 210, ${f.opacity * 0.45})`);
          radial.addColorStop(1, 'rgba(200, 202, 210, 0)');
          ctx.fillStyle = radial;
          ctx.arc(f.x, f.y, f.radius * 2.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(228, 228, 234, ${f.opacity})`;
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

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
