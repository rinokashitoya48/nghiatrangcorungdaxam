import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { RealmId, UPLOADED_ASSETS } from '../data/cemeteryData';
import { useAudio } from '../context/AudioContext';

interface RealmIntroSectionProps {
  realm: RealmId;
  onBackToGate: () => void;
  onSwitchRealm: (targetRealm: RealmId) => void;
}

export const RealmIntroSection: React.FC<RealmIntroSectionProps> = ({
  realm,
  onBackToGate,
  onSwitchRealm,
}) => {
  const { isPlaying, trackTitle, trackArtist, togglePlay } = useAudio();
  const isCoTich = realm === 'rung-co-tich';

  const portraitSrc = isCoTich
    ? UPLOADED_ASSETS.coTichGirl
    : UPLOADED_ASSETS.suongDenGirl;

  const scriptTitle = isCoTich ? 'Fairy Tale' : 'Chronicles';
  const ruledHeading = isCoTich
    ? 'nơi triền đông đượm yên'
    : 'bóng nàng ninh ních tim tôi';

  return (
    <section className="relative w-full overflow-hidden bg-transparent pt-12 pb-2 sm:pt-16 sm:pb-4">
      {/* Main Canva Container: Original 560px/px-4 on Mobile (<640px), Expanded 880px on Web/Device (sm:) */}
      <div className="mx-auto flex max-w-[560px] flex-col items-center px-4 text-center sm:w-[92%] sm:max-w-[880px] sm:px-6">
        {/* 1. TOP COMPOSITION: Compact Square Girl Photo + Spinning Vinyl Record + Overlapping SVN-Bellwethers Script */}
        <div className="relative flex w-full items-center justify-center pt-1 pb-2 sm:pt-2 sm:pb-4">
          {/* Shifted left by half the protruding vinyl radius so [Square Photo + Protruding Vinyl] is visually centered */}
          <div className="relative -ml-[24px] flex items-center justify-center sm:-ml-[46px]">
            {/* Square Girl Portrait Directly Using User's Pre-Cropped Square Image */}
            <div className="relative z-10 h-[136px] w-[136px] overflow-hidden bg-[#101010] shadow-[0_10px_28px_rgba(0,0,0,0.95)] sm:h-[260px] sm:w-[260px]">
              <img
                src={portraitSrc}
                alt={scriptTitle}
                className="block h-full w-full object-cover object-center"
              />
            </div>

            {/* Spinning Vinyl Record (78% of square height, center aligned at right edge of square photo) */}
            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? `Tạm dừng: ${trackTitle} - ${trackArtist}` : `Phát nhạc: ${trackTitle} - ${trackArtist}`}
              aria-label={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
              className="absolute top-1/2 left-full z-0 h-[106px] w-[106px] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105 sm:h-[202px] sm:w-[202px]"
            >
              <div
                className="animate-vinyl-spin relative h-full w-full rounded-full border border-[#2c2c2c] bg-[#181818] shadow-[0_8px_24px_rgba(0,0,0,0.95)]"
                style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
              >
                {/* Concentric Grooves Matching Canva Vinyl */}
                <div className="absolute inset-[7%] rounded-full border border-[#303030]/85" />
                <div className="absolute inset-[13%] rounded-full border border-[#262626]/85" />
                <div className="absolute inset-[19%] rounded-full border border-[#303030]/85" />
                <div className="absolute inset-[25%] rounded-full border border-[#262626]/85" />
                <div className="absolute inset-[31%] rounded-full border border-[#303030]/85" />
                {/* White Outer Ring + Grey Inner Circle (Right semicircle visible beside square photo) */}
                <div className="absolute top-1/2 left-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#e6e6e6]">
                  <div className="h-[72%] w-[72%] rounded-full bg-[#737373]" />
                </div>
              </div>
            </button>

            {/* Overlapping Cursive Script ("Fairy Tale" / "Chronicles") in SVN-Bellwethers font */}
            {isCoTich ? (
              <div className="pointer-events-none absolute bottom-[-2px] -left-[15px] z-20 w-max select-none sm:bottom-[-4px] sm:-left-[32px]">
                <p
                  className="font-bellwethers text-[44px] leading-none font-normal text-[#f0f0f0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-[84px]"
                  style={{ transform: 'rotate(-4.5deg)' }}
                >
                  Fairy Tale
                </p>
              </div>
            ) : (
              <div className="pointer-events-none absolute bottom-[-2px] left-[66%] z-20 w-max -translate-x-1/2 select-none sm:bottom-[-4px]">
                <p
                  className="font-bellwethers text-[44px] leading-none font-normal text-[#f0f0f0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-[84px]"
                  style={{ transform: 'rotate(-4.5deg)' }}
                >
                  Chronicles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. FOUR-POINTED STAR ORNAMENT (✦) */}
        <div className="mt-6 mb-3 flex items-center justify-center sm:mt-11 sm:mb-6">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="h-3.5 w-3.5 text-[#dcdcdc] sm:h-6 sm:w-6"
            aria-hidden="true"
          >
            <path
              d="M16 1 C16.35 12.6 19.4 15.65 31 16 C19.4 16.35 16.35 19.4 16 31 C15.65 19.4 12.6 16.35 1 16 C12.6 15.65 15.65 12.6 16 1 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* 3. HEADING IN GENUINE HP0014hang1oly FONT (WITH NATIVE BUILT-IN 4-HÀNG 1-Ô-LY LINES) */}
        <div className="relative inline-block px-2">
          <h2 className="font-hp001 text-[22px] leading-[1.45] font-normal tracking-normal text-[#ededed] sm:text-[46px]">
            {ruledHeading}
          </h2>
        </div>

        {/* 4. SMALL SUBTITLE DIRECTLY UNDERNEATH */}
        {isCoTich ? (
          <p className="font-sans-clean mt-3 max-w-[350px] text-[10px] leading-[1.48] font-light text-[#e2e2e2] sm:mt-5 sm:max-w-[720px] sm:text-[20px] sm:leading-[1.6]">
            viễn cách trùng dương, gửi đến tiết đông diệu vợi, này đây một
            <br />
            tấm chân tình đượm yên.
          </p>
        ) : (
          <p className="font-sans-clean mt-3 max-w-[370px] text-[10px] leading-[1.48] font-light text-[#e2e2e2] sm:mt-5 sm:max-w-[750px] sm:text-[20px] sm:leading-[1.6]">
            một thuở chiều thu buồn man mác, tôi ngồi dưới hiên nhà chìm bạt
            trong những vọng tưởng xăm xa nơi có nàng ăm ắp tình tôi.
          </p>
        )}

        {/* 5. FIVE-PANEL HORIZONTAL GOTHIC COLLAGE STRIP (FULL WIDTH OF CONTAINER LIKE CANVA) */}
        <div className="mt-7 w-full overflow-hidden sm:mt-12">
          <img
            src={UPLOADED_ASSETS.gothicStrip}
            alt="Gothic 5-panel collage"
            className="block h-auto w-full object-contain"
          />
        </div>

        {/* 6. UNIFIED 3-COLUMN NAVIGATION BAR */}
        <nav
          aria-label="Điều hướng khu rừng"
          className="font-sans-clean mt-8 flex w-full items-center justify-between gap-2 border-y border-white/10 py-3.5 text-[8.5px] font-normal tracking-[0.05em] text-[#d8d8d8] uppercase sm:mt-14 sm:border-white/15 sm:py-6 sm:text-[17px] sm:tracking-[0.07em]"
        >
          {/* Left: Back to Main Gate */}
          <button
            type="button"
            onClick={onBackToGate}
            className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[#d8d8d8] transition-colors hover:text-white sm:gap-2.5"
          >
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#dcdcdc] text-[#101010] transition-transform group-hover:-translate-x-0.5 sm:h-7 sm:w-7">
              <ArrowLeft className="h-2.5 w-2.5 stroke-[2.5] sm:h-4 sm:w-4" />
            </span>
            <span>CỔNG NGHĨA TRANG</span>
          </button>

          {/* Center: Cemetery Title */}
          <span className="text-center font-normal tracking-[0.05em] text-[#d8d8d8] sm:tracking-[0.07em]">
            NGHĨA TRANG CỔ RỪNG ĐÁ XÁM
          </span>

          {/* Right: Switch to the Other Realm */}
          <button
            type="button"
            onClick={() =>
              onSwitchRealm(isCoTich ? 'rung-ben-phai' : 'rung-co-tich')
            }
            className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[#d8d8d8] transition-colors hover:text-white sm:gap-2.5"
          >
            <span>{isCoTich ? 'RỪNG ĐIỂN TÍCH' : 'RỪNG CỔ TÍCH'}</span>
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#dcdcdc] text-[#101010] transition-transform group-hover:translate-x-0.5 sm:h-7 sm:w-7">
              <ArrowRight className="h-2.5 w-2.5 stroke-[2.5] sm:h-4 sm:w-4" />
            </span>
          </button>
        </nav>
      </div>
    </section>
  );
};
