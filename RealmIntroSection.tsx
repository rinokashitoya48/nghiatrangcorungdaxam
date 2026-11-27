import React from 'react';
import { RealmId, UPLOADED_ASSETS } from '../data/cemeteryData';
import { useAudio } from '../context/AudioContext';

interface RealmIntroSectionProps {
  realm: RealmId;
  onBackToGate: () => void;
  onSwitchRealm: (targetRealm: RealmId) => void;
}

/**
 * Exact 64-point curved inner aperture of the Baroque portrait frame (gothic_baroque_frame.png, 654x657),
 * traced pixel-for-pixel along the inner silver rim so the portrait sits flush inside the frame
 * while the frame's open scroll grooves stay 100% pure transparent over the dark background.
 */
const BAROQUE_FRAME_INNER_CLIP =
  'polygon(81.2% 50.0%, 81.2% 53.1%, 81.3% 56.2%, 81.2% 59.4%, 81.2% 62.9%, 81.2% 66.6%, 81.2% 70.8%, 81.3% 75.5%, 78.7% 78.5%, 76.2% 81.8%, 71.8% 82.5%, 67.5% 82.6%, 63.6% 82.7%, 60.1% 83.0%, 56.8% 83.9%, 53.5% 85.0%, 50.0% 85.7%, 46.5% 85.0%, 43.2% 83.9%, 39.9% 83.1%, 36.4% 82.7%, 32.5% 82.6%, 28.2% 82.5%, 23.8% 81.8%, 21.2% 78.7%, 18.7% 75.5%, 18.5% 71.0%, 18.4% 66.8%, 18.6% 62.9%, 18.5% 59.5%, 18.6% 56.2%, 18.7% 53.1%, 18.6% 50.0%, 18.5% 46.9%, 18.4% 43.7%, 18.5% 40.5%, 18.6% 37.1%, 18.4% 33.2%, 18.6% 29.1%, 18.6% 24.4%, 21.2% 21.3%, 23.7% 18.1%, 28.0% 17.3%, 32.4% 17.3%, 36.3% 17.2%, 39.9% 16.9%, 43.2% 16.0%, 46.5% 14.9%, 50.0% 14.1%, 53.5% 15.0%, 56.8% 16.1%, 60.1% 16.9%, 63.7% 17.2%, 67.6% 17.3%, 72.0% 17.3%, 76.2% 18.2%, 78.7% 21.5%, 81.3% 24.5%, 81.2% 29.2%, 81.2% 33.4%, 81.2% 37.1%, 81.2% 40.6%, 81.4% 43.8%, 81.2% 46.9%)';

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

  const portraitAlt = isCoTich ? 'Rừng Cổ Tích' : 'Rừng Điển Tích';

  const realmDisplayHeading = isCoTich ? 'Fairy Tale' : 'Folklore';

  return (
    <section className="relative w-full pt-[1.5cqw] pb-[3cqw]">
      <div className="mx-auto flex flex-col items-center px-[9.5%] text-center">
        {/* 1. BƯỚM ĐÊM DƯỚI ĐỈNH VÒM (1:1 cqw tỷ lệ chuẩn Mobile & Web/Device) */}
        <div className="mt-[13%] mb-[2.1cqw] flex items-center justify-center">
          <img
            src="/assets/aistudio/gothic_moth.png?v=12"
            alt="Bướm đêm Gothic"
            referrerPolicy="no-referrer"
            className="gothic-chalk-print h-auto w-[16cqw] object-contain opacity-95"
          />
        </div>

        {/* 2. KHUNG CHÂN DUNG BAROQUE */}
        <div className="relative flex w-full items-center justify-center">
          <div
            onClick={togglePlay}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePlay();
              }
            }}
            title={
              isPlaying
                ? `Tạm dừng nhạc: ${trackTitle} - ${trackArtist}`
                : `Phát nhạc: ${trackTitle} - ${trackArtist}`
            }
            aria-label={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
            className="group relative aspect-[654/657] w-[30cqw] cursor-pointer select-none"
          >
            {/* Layer 1 (z-20): Portrait Clipped Precisely to the Curved Inner Baroque Rim */}
            <div
              className="absolute inset-0 z-20 overflow-hidden bg-[#060608]"
              style={{ clipPath: BAROQUE_FRAME_INNER_CLIP }}
            >
              <img
                src={portraitSrc}
                alt={portraitAlt}
                referrerPolicy="no-referrer"
                className="block h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.78)]" />
            </div>

            {/* Layer 2 (z-30): Silver-Chalk Baroque Frame */}
            <img
              src="/assets/aistudio/gothic_baroque_frame.png?v=13"
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="gothic-chalk-print pointer-events-none absolute inset-0 z-30 h-full w-full object-contain opacity-95 transition-transform duration-500 group-hover:scale-[1.015]"
            />
          </div>
        </div>

        {/* 3. TIÊU ĐỀ FONT A Gothique Time (1:1 cqw) */}
        <div className="relative mt-[2.4cqw] inline-block px-1">
          <h2
            className={`font-gothique gothic-time-chalk leading-[1.06] font-normal tracking-[0.03em] whitespace-nowrap ${
              isCoTich ? 'text-[15.4cqw]' : 'text-[16.8cqw]'
            }`}
          >
            {realmDisplayHeading}
          </h2>
        </div>

        {/* 4. QUOTES PHỤ (1:1 cqw — thoáng nhẹ chuẩn nhịp editorial) */}
        {isCoTich ? (
          <p className="font-sans-clean gothic-text-chalk mt-[2.2cqw] flex w-full flex-col items-center text-[2.42cqw] leading-[1.62] font-normal tracking-[0.015em] text-[#b4b4be]">
            <span className="block whitespace-nowrap">
              viễn cách trùng dương, gửi đến tiết đông diệu vợi,
            </span>
            <span className="block whitespace-nowrap">
              này đây một tấm chân tình đượm yên.
            </span>
          </p>
        ) : (
          <p className="font-sans-clean gothic-text-chalk mt-[2.2cqw] flex w-full flex-col items-center text-[2.42cqw] leading-[1.62] font-normal tracking-[0.015em] text-[#b4b4be]">
            <span className="block whitespace-nowrap">
              một thuở chiều thu buồn man mác,
            </span>
            <span className="block whitespace-nowrap">
              tôi ngồi dưới hiên nhà chìm bạt trong những
            </span>
            <span className="block whitespace-nowrap">
              vọng tưởng xăm xa nơi có nàng ăm ắp tình tôi.
            </span>
          </p>
        )}

        {/* 5. ELEMENT Ở GIỮA — MẶT DÂY CHÙM HOA VĂN KHẮC CỔ THANH MẢNH */}
        <button
          type="button"
          onClick={togglePlay}
          title={
            isPlaying
              ? `Đang phát: ${trackTitle} — Nhấn để tạm dừng`
              : `Nhấn để ngân vang giai điệu: ${trackTitle}`
          }
          className="group mt-[7.2cqw] mb-[8.8cqw] inline-flex cursor-pointer flex-col items-center justify-center focus:outline-none"
        >
          <img
            src="/assets/aistudio/gothic_hanging_pendant.png?v=1"
            alt="Hoa văn chùm treo khắc cổ Gothic"
            referrerPolicy="no-referrer"
            className={`gothic-chalk-print h-auto w-[10.8cqw] object-contain transition-all duration-500 ${
              isPlaying
                ? 'opacity-98 drop-shadow-[0_0_14px_rgba(216,216,226,0.28)] group-hover:scale-[1.04]'
                : 'opacity-90 group-hover:scale-[1.04] group-hover:opacity-100'
            }`}
          />
        </button>

        {/* 6. HAI CỔNG ĐIỀU HƯỚNG — CHỮ NHỎ THANH, GIÃN RỘNG & THOÁNG MẮT */}
        <nav
          aria-label="Điều hướng khu rừng"
          className="mb-[5.5cqw] flex w-full flex-col items-center justify-center gap-[5.8cqw]"
        >
          {/* Portal 1: Back to Gatekeeper Introduction Page */}
          <button
            type="button"
            onClick={onBackToGate}
            className="group flex cursor-pointer flex-col items-center justify-center focus:outline-none"
          >
            <span className="font-serif-title gothic-text-chalk flex items-center gap-[2.8cqw] text-[2.85cqw] leading-none font-normal tracking-[0.24em] whitespace-nowrap text-[#c0c0ca] uppercase transition-all duration-300 group-hover:tracking-[0.28em] group-hover:text-[#ececf4]">
              <span
                aria-hidden="true"
                className="text-[0.62em] text-[#9a9aa4] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#ececf4]"
              >
                ✦
              </span>
              <span>NGƯỜI GÁC CỔNG</span>
              <span
                aria-hidden="true"
                className="text-[0.62em] text-[#9a9aa4] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#ececf4]"
              >
                ✦
              </span>
            </span>
            <span
              aria-hidden="true"
              className="mt-[2.1cqw] block h-px w-[20cqw] bg-gradient-to-r from-transparent via-[#a4a4ae]/55 to-transparent transition-all duration-300 group-hover:w-[27cqw] group-hover:via-[#e2e2ec]/85"
            />
          </button>

          {/* Portal 2: Switch to the Other Forest Realm */}
          <button
            type="button"
            onClick={() =>
              onSwitchRealm(isCoTich ? 'rung-ben-phai' : 'rung-co-tich')
            }
            className="group flex cursor-pointer flex-col items-center justify-center focus:outline-none"
          >
            <span className="font-serif-title gothic-text-chalk flex items-center gap-[2.8cqw] text-[2.85cqw] leading-none font-normal tracking-[0.24em] whitespace-nowrap text-[#c0c0ca] uppercase transition-all duration-300 group-hover:tracking-[0.28em] group-hover:text-[#ececf4]">
              <span
                aria-hidden="true"
                className="text-[0.62em] text-[#9a9aa4] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#ececf4]"
              >
                ✦
              </span>
              <span>{isCoTich ? 'RỪNG ĐIỂN TÍCH' : 'RỪNG CỔ TÍCH'}</span>
              <span
                aria-hidden="true"
                className="text-[0.62em] text-[#9a9aa4] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#ececf4]"
              >
                ✦
              </span>
            </span>
            <span
              aria-hidden="true"
              className="mt-[2.1cqw] block h-px w-[20cqw] bg-gradient-to-r from-transparent via-[#a4a4ae]/55 to-transparent transition-all duration-300 group-hover:w-[27cqw] group-hover:via-[#e2e2ec]/85"
            />
          </button>
        </nav>
      </div>
    </section>
  );
};
