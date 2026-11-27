import React from 'react';

export const GothicCrossDivider: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`flex items-center justify-center gap-4 select-none ${className}`}
    aria-hidden="true"
  >
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-600/70 to-zinc-400/80" />
    <svg
      viewBox="0 0 36 36"
      className="h-5 w-5 text-zinc-400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 2L20.2 9.5L26 7L23.5 12.8L34 18L23.5 23.2L26 29L20.2 26.5L18 34L15.8 26.5L10 29L12.5 23.2L2 18L12.5 12.8L10 7L15.8 9.5L18 2Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="18" cy="18" r="2.5" fill="currentColor" />
    </svg>
    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-zinc-600/70 to-zinc-400/80" />
  </div>
);

export const GothicArchHeaderOrnament: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <img
    src="/assets/aistudio/gothic_center_ornament.png"
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`pointer-events-none select-none object-contain ${className}`}
  />
);

/**
 * Reusable Analog Film Grain (Nhiễu hạt) & Distressed Chalk Dust (Bụi bụi) Overlay
 * Also provides the global #gothic-chalk-print SVG filter so central typography
 * shares the exact weathered lithograph / stone-rubbing texture of the filigree ornaments.
 */
export const GothicFilmGrainOverlay: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none fixed inset-0 z-30 overflow-hidden select-none ${className}`}
    style={{ transform: 'translateZ(0)' }}
  >
    {/* Pre-baked Seamless Transparent Film Grain & Chalk Dust Tile (GPU-composited, zero live CPU feTurbulence lag) */}
    <div
      className="absolute inset-0 opacity-80"
      style={{
        backgroundImage: "url('/assets/aistudio/gothic_grain_tile.png?v=2')",
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
    />

    {/* Hidden SVG Filter Defs Only (0x0) for #gothic-chalk-print & #gothic-text-chalk — optimized to 2 octaves for crisp 60fps scrolling */}
    <svg
      className="absolute h-0 w-0 overflow-hidden"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Weathered Lithograph Filter for Graphic Elements & Ornaments */}
        <filter
          id="gothic-chalk-print"
          x="-15%"
          y="-20%"
          width="130%"
          height="140%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="2"
            seed="27"
            result="chalkTex"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.88
                    0 0 0 0 0.88
                    0 0 0 0 0.91
                    0 0 0 1.75 -0.04"
            in="chalkTex"
            result="chalkAlphaMask"
          />
          <feComposite
            operator="in"
            in="SourceGraphic"
            in2="chalkAlphaMask"
          />
        </filter>

        {/* High-Definition Weathered Chalk-Stipple & Engraved Stone Filter for Solid Typography */}
        <filter
          id="gothic-text-chalk"
          x="-20%"
          y="-30%"
          width="140%"
          height="160%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72 0.78"
            numOctaves="2"
            seed="19"
            result="fineChalk"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="fineChalk"
            scale="0.7"
            xChannelSelector="R"
            yChannelSelector="G"
            result="roughenedText"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.82
                    0 0 0 0 0.82
                    0 0 0 0 0.85
                    0 0 0 2.15 -0.24"
            in="fineChalk"
            result="textChalkMask"
          />
          <feComposite
            operator="in"
            in="roughenedText"
            in2="textChalkMask"
          />
        </filter>
      </defs>
    </svg>
  </div>
);

/**
 * Unified Gothic Frame & Distressed Grain Backdrop
 * - True pitch-black interior (#030304) with zero grey fog
 * - Single unified 9-slice Gothic frame (/assets/aistudio/gothic_unified_9slice.png)
 * - Crisp alpha-thresholded grain (nhiễu hạt) & chalk dust (bụi bụi) over pure black
 */
export const GothicLayeredEntranceBackdrop: React.FC = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden select-none"
      >
        {/* 1. True Deep Black Base (#030304) */}
        <div className="absolute inset-0 bg-[#030304]" />

        {/* 2. Unified 9-Slice Gothic Frame */}
        <div className="gothic-unified-frame absolute inset-[calc(var(--u)*1.4)] opacity-92" />
      </div>

      {/* 3. Global Film Grain & Chalk Dust Overlay (Pure black stays black, only grain & dust specks are visible) */}
      <GothicFilmGrainOverlay />
    </>
  );
};

/**
 * Dreamy Twin-Spire Gothic Sparkle (Two Separated Slender 4-Point Stars)
 * Keeps a clean dark air gap between the petite outer star and taller inner star so they never clump at small sizes.
 */
export const GothicTwinStarIcon: React.FC<{ className?: string }> = ({
  className = 'h-[4cqw] w-[4.5cqw]',
}) => (
  <svg
    viewBox="0 0 88 78"
    fill="none"
    aria-hidden="true"
    className={`gothic-chalk-print select-none ${className}`}
  >
    {/* Soft misty halo */}
    <g opacity="0.34" fill="#d4d4e0">
      <path d="M22 14 Q22 36.2 39 39 Q22 41.8 22 64 Q22 41.8 5 39 Q22 36.2 22 14 Z" />
      <path d="M62 4 Q62 35.6 82 39 Q62 42.4 62 74 Q62 42.4 42 39 Q62 35.6 62 4 Z" />
    </g>
    {/* Crisp separated silver-ash twin stars */}
    <g fill="#c8c8d2">
      <path d="M22 16 Q22 36.8 38 39 Q22 41.2 22 62 Q22 41.2 6 39 Q22 36.8 22 16 Z" />
      <path d="M62 6 Q62 36.2 81 39 Q62 41.8 62 72 Q62 41.8 43 39 Q62 36.2 62 6 Z" />
    </g>
  </svg>
);
