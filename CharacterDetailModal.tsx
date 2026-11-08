import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { CharacterProfile, ImageCropConfig } from '../data/cemeteryData';
import { GothicCrossDivider } from './GothicOrnaments';
import { AuthenticPhotoFrame } from './AuthenticPhotoFrame';

interface CharacterDetailModalProps {
  character: CharacterProfile | null;
  onClose: () => void;
  onUpdateAvatar?: (charId: string, newAvatar: ImageCropConfig) => void;
  onAppendPhotoToCharacter?: (charId: string, newPhoto: ImageCropConfig) => void;
  onDeleteCharacter?: (charId: string) => void;
  rightForestName: string;
}

/**
 * Helper to render delicate small separator dots instead of chunky bold bullets,
 * ensuring segments never break mid-phrase (e.g. "Rừng Sương Đen" stays intact).
 */
function renderDelicateSeparators(text: string): React.ReactNode {
  if (!text) return null;
  if (text.includes('•') || text.includes('·')) {
    const parts = text.split(/[•·]/);
    return (
      <>
        {parts.map((part, idx) => (
          <React.Fragment key={idx}>
            <span className="whitespace-nowrap">{part.trim()}</span>
            {idx < parts.length - 1 && (
              <span
                aria-hidden="true"
                className="mx-1.5 sm:mx-2 inline-block text-[5px] sm:text-[6px] text-zinc-400/80 align-middle select-none"
              >
                ●
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  }
  return <span className="whitespace-nowrap">{text}</span>;
}

/**
 * Helper to render inline *italic* segments cleanly
 */
function renderFormattedParagraph(text: string): React.ReactNode {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic text-zinc-100">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  onClose,
  onDeleteCharacter,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!character) return null;

  const allImages: ImageCropConfig[] = [
    character.avatar,
    ...character.gallery,
  ];
  const currentImg = allImages[activeImageIdx] || character.avatar;

  const storyParagraphs = character.story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-2 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[93vh] w-full max-w-2xl flex-col overflow-hidden bg-[#030304] shadow-[0_0_60px_rgba(0,0,0,0.98)] sm:w-[90%] sm:max-w-[840px]"
      >
        {/* Main Screen's Unified 9-Slice Gothic Outer Frame */}
        <div
          aria-hidden="true"
          className="gothic-modal-unified-frame pointer-events-none absolute inset-1 z-20 opacity-95 sm:inset-2.5"
        />

        {/* Top-Right Action Buttons */}
        <div className="absolute top-6 right-6 z-30 flex items-center gap-2 sm:top-10 sm:right-10">
          {character.isCustom && onDeleteCharacter && (
            <button
              type="button"
              onClick={() => {
                onDeleteCharacter(character.id);
                onClose();
              }}
              className="flex h-7 items-center gap-1.5 border border-red-900/70 bg-red-950/60 px-2.5 text-[11px] text-red-200 backdrop-blur-xs transition-colors hover:border-red-500 sm:h-9 sm:px-3.5 sm:text-sm"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Xóa</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center border border-zinc-600/70 bg-[#050507]/85 text-zinc-300 backdrop-blur-xs transition-colors hover:border-zinc-300 hover:text-white sm:h-9 sm:w-9"
            aria-label="Đóng hồ sơ"
          >
            <X className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
          </button>
        </div>

        {/* Soft Top & Bottom Vignettes so scrolling text never clashes with Corner Filigrees */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[22px] right-[22px] left-[22px] z-15 h-9 bg-gradient-to-b from-[#030304] via-[#030304]/75 to-transparent sm:top-[38px] sm:right-[38px] sm:left-[38px] sm:h-12"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[22px] bottom-[22px] left-[22px] z-15 h-12 bg-gradient-to-t from-[#030304] via-[#030304]/85 to-transparent sm:right-[38px] sm:bottom-[38px] sm:left-[38px] sm:h-16"
        />

        {/* Scrollable Content Inset Inside the Gothic Frame Double Lines */}
        <div className="relative z-10 m-[22px] overflow-y-auto px-3.5 pt-5 pb-12 sm:m-[38px] sm:px-8 sm:pt-7 sm:pb-16">
          {/* Centered & Balanced Header Synchronized with Main Entrance Typography */}
          <header className="gothic-chalk-print border-b border-zinc-800/90 px-8 pt-2 pb-4 text-center sm:px-14 sm:pt-2 sm:pb-5">
            <div className="mb-1 flex items-center justify-center gap-1.5 font-serif-title text-[9px] leading-none font-normal tracking-[0.11em] text-[#c4c4cc] uppercase sm:mb-1.5 sm:gap-2.5 sm:text-[15px] sm:tracking-[0.24em]">
              <span aria-hidden="true" className="shrink-0 text-[7px] text-[#a1a1aa] sm:text-[10px]">
                ✦
              </span>
              <span className="flex flex-wrap items-center justify-center gap-1 text-center">
                {renderDelicateSeparators(
                  character.affiliations || 'Biển Vĩnh Hằng • Rừng Điển Tích'
                )}
              </span>
              <span aria-hidden="true" className="shrink-0 text-[7px] text-[#a1a1aa] sm:text-[10px]">
                ✦
              </span>
            </div>

            <h2
              id="character-modal-title"
              className="font-serif-title text-2xl leading-[1.05] font-normal tracking-[0.11em] text-[#e6e6ec] uppercase sm:text-[44px] sm:tracking-[0.14em]"
            >
              {character.name}
            </h2>

            <p className="font-serif-title mt-1 text-[13.5px] leading-snug font-light italic text-[#d0d0d6] sm:mt-1 sm:text-[22px]">
              “{character.alias}”
            </p>
          </header>

          {/* Main Content Stack */}
          <div className="mt-5 space-y-6 sm:mt-7 sm:space-y-8">
            {/* Uncropped Character Portrait */}
            <div className="relative aspect-square w-full overflow-hidden border border-zinc-800 bg-[#101010]">
              <AuthenticPhotoFrame
                image={currentImg}
                alt={character.name}
                spectralMotion={true}
                preserveColor={true}
                className="h-full w-full"
              />
            </div>

            {/* Thumbnails (if multiple images) */}
            {allImages.length > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {allImages.map((imgItem, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-14 w-14 overflow-hidden border transition-all sm:h-20 sm:w-20 ${
                      activeImageIdx === idx
                        ? 'border-zinc-200 ring-1 ring-zinc-200'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <AuthenticPhotoFrame
                      image={imgItem}
                      alt={`${character.name} ${idx + 1}`}
                      spectralMotion={false}
                      preserveColor={true}
                      className="h-full w-full"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 1. Dedicated Link Frame Synchronized with Main Screen Double-Stepped Frame (No Side Stars) */}
            {character.promptLink && (
              <div className="px-1 sm:px-4">
                <a
                  href={character.promptLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center border border-[#c8c8ce]/50 bg-[#050507]/90 px-5 py-3.5 text-center transition-all duration-300 hover:border-[#ececef] hover:bg-[#0e0e13] sm:px-8 sm:py-5"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[2.5px] border border-[#a1a1aa]/25 transition-colors duration-300 group-hover:border-[#d4d4d8]/55 sm:inset-[3.5px]"
                  />
                  <span className="relative z-10 font-serif-title text-[12.5px] leading-relaxed font-normal tracking-[0.05em] text-[#e4e4ea] uppercase italic underline-offset-4 group-hover:text-white group-hover:underline sm:text-[19px]">
                    {character.promptLink.text}
                  </span>
                </a>
              </div>
            )}

            {/* 2. Open Engraved Epitaph Inscription (Harmonized with Top Header — Zero Clunky Grey Box) */}
            <div className="gothic-chalk-print px-2 text-center sm:px-6">
              {/* Top Tapered Hairline */}
              <div
                aria-hidden="true"
                className="mx-auto mb-5 h-px w-4/5 bg-gradient-to-r from-transparent via-zinc-700/80 to-transparent sm:mb-7"
              />

              {/* Symmetrical 2-Column Lockup: Cổ Tự Khắc Bia & Khế Ước Linh Hồn */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-1 flex items-center justify-center gap-1.5 font-serif-title text-[9.5px] tracking-[0.22em] text-[#a6a6b0] uppercase sm:mb-1.5 sm:gap-2 sm:text-[13.5px]">
                    <span aria-hidden="true" className="text-[7px] text-[#8e8e98] sm:text-[9px]">
                      ✦
                    </span>
                    <span>Cổ Tự Khắc Bia</span>
                    <span aria-hidden="true" className="text-[7px] text-[#8e8e98] sm:text-[9px]">
                      ✦
                    </span>
                  </div>
                  <div className="font-serif-title text-[15px] font-normal tracking-[0.04em] text-[#ececef] sm:text-[21px]">
                    {renderDelicateSeparators(
                      character.appearance || 'Phương Tây Huyền Ảo • Tình Trai'
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-t border-zinc-800/60 pt-4 sm:border-t-0 sm:border-l sm:border-zinc-800/70 sm:pt-0 sm:pl-6">
                  <div className="mb-1 flex items-center justify-center gap-1.5 font-serif-title text-[9.5px] tracking-[0.22em] text-[#a6a6b0] uppercase sm:mb-1.5 sm:gap-2 sm:text-[13.5px]">
                    <span aria-hidden="true" className="text-[7px] text-[#8e8e98] sm:text-[9px]">
                      ✦
                    </span>
                    <span>Khế Ước Linh Hồn</span>
                    <span aria-hidden="true" className="text-[7px] text-[#8e8e98] sm:text-[9px]">
                      ✦
                    </span>
                  </div>
                  <div className="font-serif-title text-[15px] font-normal tracking-[0.04em] text-[#ececef] sm:text-[21px]">
                    {character.personality ||
                      'Thần Chết × User (Thần Chết Tập Sự)'}
                  </div>
                </div>
              </div>

              {/* Bối Cảnh: Centered Literary Quote Style Matching Main Screen */}
              {(character.backgroundContext || character.quote) && (
                <div className="mt-6 pt-5 sm:mt-8 sm:pt-7">
                  <div className="mb-3 flex items-center justify-center gap-3 sm:mb-4 sm:gap-4">
                    <div className="h-px flex-1 max-w-[72px] bg-gradient-to-r from-transparent to-zinc-600/70 sm:max-w-[120px]" />
                    <span className="flex items-center gap-1.5 font-serif-title text-[9.5px] tracking-[0.24em] text-[#a6a6b0] uppercase sm:gap-2 sm:text-[13.5px]">
                      <span aria-hidden="true" className="text-[7px] text-[#8e8e98] sm:text-[9px]">
                        ✦
                      </span>
                      <span>Bối Cảnh</span>
                      <span aria-hidden="true" className="text-[7px] text-[#8e8e98] sm:text-[9px]">
                        ✦
                      </span>
                    </span>
                    <div className="h-px flex-1 max-w-[72px] bg-gradient-to-l from-transparent to-zinc-600/70 sm:max-w-[120px]" />
                  </div>

                  <p className="font-serif-title mx-auto max-w-[94%] text-[14.5px] leading-[1.75] font-light italic text-[#d8d8e0] sm:text-[20px] sm:leading-[1.8]">
                    “{character.backgroundContext || character.quote}”
                  </p>
                </div>
              )}

              {/* Chalk-Print Hairline Divider with Enlarged 4-Pointed Star */}
              <div
                aria-hidden="true"
                className="mx-auto mt-6 flex w-4/5 items-center justify-center gap-3.5 sm:mt-8 sm:gap-4"
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-700/70" />
                <span className="text-[13px] leading-none text-[#8e8e98] sm:text-[17px]">
                  ✦
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-700/70" />
              </div>
            </div>

            {/* 3. Story Content (Harmonized in Cormorant Garamond Serif & Chalk-Silver Tone to Match Bối Cảnh) */}
            <div className="px-2 sm:px-5">
              <div className="font-serif-title space-y-4 text-left text-[15.5px] leading-[1.82] font-normal text-[#dcdce4] sm:space-y-5 sm:text-[21px] sm:leading-[1.88]">
                {storyParagraphs.map((paragraph, idx) => {
                  const isDivider = paragraph === '***' || paragraph === '* * *';
                  if (isDivider) {
                    return (
                      <div
                        key={idx}
                        aria-hidden="true"
                        className="gothic-chalk-print flex items-center justify-center gap-3.5 py-2 text-[11px] tracking-[0.4em] text-[#8e8e98] select-none sm:py-3 sm:text-[14px]"
                      >
                        <span>✦</span>
                        <span>✦</span>
                        <span>✦</span>
                      </div>
                    );
                  }
                  return (
                    <p key={idx}>
                      {renderFormattedParagraph(paragraph)}
                    </p>
                  );
                })}
              </div>

              {/* Closing Tailpiece Ornament */}
              <div
                aria-hidden="true"
                className="gothic-chalk-print mt-8 flex items-center justify-center gap-3 sm:mt-12"
              >
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-zinc-700/70 sm:w-16" />
                <span className="text-[11px] text-[#8e8e98] sm:text-[14px]">✦</span>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-zinc-700/70 sm:w-16" />
              </div>
            </div>

            {(character.relationships.length > 0 ||
              character.trinkets.length > 0) && <GothicCrossDivider />}

            {character.relationships.length > 0 && (
              <div className="px-2 sm:px-5">
                <h3 className="text-center font-serif-title text-xs tracking-widest text-zinc-400 uppercase">
                  Mối Quan Hệ & Liên Kết
                </h3>
                <div className="mt-3 space-y-2.5">
                  {character.relationships.map((rel, idx) => (
                    <div
                      key={idx}
                      className="border-b border-zinc-800/70 pb-3 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <span className="font-semibold text-zinc-100">
                          {rel.name}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="italic text-zinc-400">
                          {rel.relation}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-300">{rel.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {character.trinkets.length > 0 && (
              <div className="px-2 sm:px-5">
                <h3 className="text-center font-serif-title text-xs tracking-widest text-zinc-400 uppercase">
                  Di Vật & Kỷ Vật Mang Theo
                </h3>
                <ul className="mt-2.5 space-y-2 text-sm text-zinc-300">
                  {character.trinkets.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-baseline justify-center gap-3 border-b border-zinc-800/60 pb-1.5"
                    >
                      <span className="font-tabular text-xs text-zinc-500">
                        0{idx + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
