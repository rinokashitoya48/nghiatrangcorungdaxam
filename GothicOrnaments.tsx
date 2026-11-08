import React from 'react';

export const GothicCornerFiligree: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <img
    src="/assets/aistudio/vintage_corner_ornament.png"
    alt=""
    aria-hidden="true"
    draggable={false}
    className={`pointer-events-none select-none object-contain ${className}`}
  />
);

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
  >
    {/* Pure Alpha-Thresholded Film Grain & Chalk Dust Speckles (Zero Grey Wash Over Black Background) */}
    <svg
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* High-threshold fine grain: >88% of pixels have alpha=0 so pure black #000 stays 100% black */}
        <filter id="gothic-fine-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
            result="grain"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.85
                    0 0 0 0 0.85
                    0 0 0 0 0.88
                    0 0 0 5.5 -3.45"
            in="grain"
          />
        </filter>

        {/* Sparse organic chalk dust specks */}
        <filter id="gothic-chalk-specks">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.09 0.12"
            numOctaves="3"
            seed="42"
            result="dustRaw"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.9
                    0 0 0 0 0.9
                    0 0 0 0 0.92
                    0 0 0 9.5 -6.85"
            in="dustRaw"
          />
        </filter>

        {/* Subtle Weathered Lithograph Filter for Typography Harmonization */}
        <filter
          id="gothic-chalk-print"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.88"
            numOctaves="4"
            seed="27"
            result="chalkTex"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 1.45 0.22"
            in="chalkTex"
            result="chalkAlphaMask"
          />
          <feComposite
            operator="in"
            in="SourceGraphic"
            in2="chalkAlphaMask"
          />
        </filter>
      </defs>

      <rect
        width="100%"
        height="100%"
        filter="url(#gothic-fine-grain)"
        opacity="0.32"
      />
      <rect
        width="100%"
        height="100%"
        filter="url(#gothic-chalk-specks)"
        opacity="0.45"
      />
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
        <div className="gothic-unified-frame absolute inset-1.5 opacity-92 sm:inset-3 md:inset-4" />
      </div>

      {/* 3. Global Film Grain & Chalk Dust Overlay (Pure black stays black, only grain & dust specks are visible) */}
      <GothicFilmGrainOverlay />
    </>
  );
};
