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
                className="mx-[1.4cqw] inline-block text-[0.42em] text-zinc-400/80 align-middle select-none"
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-[2vmin] backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[93vh] w-[96%] max-w-[900px] flex-col overflow-hidden bg-[#030304] shadow-[0_0_60px_rgba(0,0,0,0.98)] [container-type:inline-size]"
      >
        {/* Main Screen's Unified 9-Slice Gothic Outer Frame */}
        <div
          aria-hidden="true"
          className="gothic-modal-unified-frame pointer-events-none absolute inset-[1cqw] z-20 opacity-95"
        />

        {/* Top-Right Action Buttons */}
        <div className="absolute top-[5.8cqw] right-[5.8cqw] z-30 flex items-center gap-[1.8cqw]">
          {character.isCustom && onDeleteCharacter && (
            <button
              type="button"
              onClick={() => {
                onDeleteCharacter(character.id);
                onClose();
              }}
              className="flex h-[7.2cqw] items-center gap-[1.4cqw] border border-red-900/70 bg-red-950/60 px-[2.8cqw] text-[2.8cqw] text-red-200 backdrop-blur-xs transition-colors hover:border-red-500"
            >
              <Trash2 className="h-[3.4cqw] w-[3.4cqw]" />
              <span>Xóa</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-[7.2cqw] w-[7.2cqw] cursor-pointer items-center justify-center border border-zinc-600/70 bg-[#050507]/85 text-zinc-300 backdrop-blur-xs transition-colors hover:border-zinc-300 hover:text-white"
            aria-label="Đóng hồ sơ"
          >
            <X className="h-[3.8cqw] w-[3.8cqw]" />
          </button>
        </div>

        {/* Soft Top & Bottom Vignettes so scrolling text never clashes with Corner Filigrees */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[5.6cqw] right-[5.6cqw] left-[5.6cqw] z-15 h-[8.5cqw] bg-gradient-to-b from-[#030304] via-[#030304]/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[5.6cqw] bottom-[5.6cqw] left-[5.6cqw] z-15 h-[11cqw] bg-gradient-to-t from-[#030304] via-[#030304]/85 to-transparent"
        />

        {/* Scrollable Content Inset Inside the Gothic Frame Double Lines */}
        <div className="relative z-10 m-[5.6cqw] overflow-y-auto px-[3.8cqw] pt-[5cqw] pb-[12cqw]">
          {/* Centered & Balanced Header Synchronized with Main Entrance Typography */}
          <header className="gothic-chalk-print border-b border-zinc-800/90 px-[8cqw] pt-[2cqw] pb-[4cqw] text-center">
            <div className="mb-[1.2cqw] flex items-center justify-center gap-[1.6cqw] font-serif-title text-[2.45cqw] leading-none font-normal tracking-[0.14em] text-[#c4c4cc] uppercase">
              <span aria-hidden="true" className="shrink-0 text-[0.75em] text-[#a1a1aa]">
                ✦
              </span>
              <span className="flex flex-wrap items-center justify-center gap-1 text-center">
                {renderDelicateSeparators(
                  character.affiliations || 'Biển Vĩnh Hằng • Rừng Điển Tích'
                )}
              </span>
              <span aria-hidden="true" className="shrink-0 text-[0.75em] text-[#a1a1aa]">
                ✦
              </span>
            </div>

            <h2
              id="character-modal-title"
              className="font-serif-title text-[6.4cqw] leading-[1.06] font-normal tracking-[0.12em] text-[#e6e6ec] uppercase"
            >
              {character.name}
            </h2>

            <p className="font-serif-title mt-[1.2cqw] text-[3.5cqw] leading-snug font-light italic text-[#d0d0d6]">
              “{character.alias}”
            </p>
          </header>

          {/* Main Content Stack */}
          <div className="mt-[5cqw] space-y-[6cqw]">
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
              <div className="flex flex-wrap items-center justify-center gap-[2.2cqw]">
                {allImages.map((imgItem, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-[14cqw] w-[14cqw] overflow-hidden border transition-all ${
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
              <div className="px-[1cqw]">
                <a
                  href={character.promptLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center border border-[#c8c8ce]/50 bg-[#050507]/90 px-[5cqw] py-[3.5cqw] text-center transition-all duration-300 hover:border-[#ececef] hover:bg-[#0e0e13]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[0.75cqw] border border-[#a1a1aa]/25 transition-colors duration-300 group-hover:border-[#d4d4d8]/55"
                  />
                  <span className="relative z-10 font-serif-title text-[3.1cqw] leading-relaxed font-normal tracking-[0.05em] text-[#e4e4ea] uppercase italic underline-offset-4 group-hover:text-white group-hover:underline">
                    {character.promptLink.text}
                  </span>
                </a>
              </div>
            )}

            {/* 2. Open Engraved Epitaph Inscription (Harmonized with Top Header — 1:1 Mobile & Web/Device) */}
            <div className="gothic-chalk-print px-[2cqw] text-center">
              {/* Top Tapered Hairline */}
              <div
                aria-hidden="true"
                className="mx-auto mb-[5cqw] h-px w-4/5 bg-gradient-to-r from-transparent via-zinc-700/80 to-transparent"
              />

              {/* Stacked Lockup Synchronized 1:1 Across Mobile & Web/Device: Cổ Tự Khắc Bia & Khế Ước Linh Hồn */}
              <div className="grid grid-cols-1 gap-[4.5cqw]">
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-[1.2cqw] flex items-center justify-center gap-[1.5cqw] font-serif-title text-[2.3cqw] tracking-[0.22em] text-[#a6a6b0] uppercase">
                    <span aria-hidden="true" className="text-[0.75em] text-[#8e8e98]">
                      ✦
                    </span>
                    <span>Cổ Tự Khắc Bia</span>
                    <span aria-hidden="true" className="text-[0.75em] text-[#8e8e98]">
                      ✦
                    </span>
                  </div>
                  <div className="font-serif-title text-[3.4cqw] font-normal tracking-[0.04em] text-[#ececef]">
                    {renderDelicateSeparators(
                      character.appearance || 'Phương Tây Huyền Ảo • Tình Trai'
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-t border-zinc-800/60 pt-[4cqw]">
                  <div className="mb-[1.2cqw] flex items-center justify-center gap-[1.5cqw] font-serif-title text-[2.3cqw] tracking-[0.22em] text-[#a6a6b0] uppercase">
                    <span aria-hidden="true" className="text-[0.75em] text-[#8e8e98]">
                      ✦
                    </span>
                    <span>Khế Ước Linh Hồn</span>
                    <span aria-hidden="true" className="text-[0.75em] text-[#8e8e98]">
                      ✦
                    </span>
                  </div>
                  <div className="font-serif-title text-[3.4cqw] font-normal tracking-[0.04em] text-[#ececef]">
                    {character.personality ||
                      'Thần Chết × User (Thần Chết Tập Sự)'}
                  </div>
                </div>
              </div>

              {/* Bối Cảnh: Centered Literary Quote Style Matching Main Screen */}
              {(character.backgroundContext || character.quote) && (
                <div className="mt-[6cqw] pt-[5cqw]">
                  <div className="mb-[3cqw] flex items-center justify-center gap-[3cqw]">
                    <div className="h-px flex-1 max-w-[18cqw] bg-gradient-to-r from-transparent to-zinc-600/70" />
                    <span className="flex items-center gap-[1.5cqw] font-serif-title text-[2.3cqw] tracking-[0.24em] text-[#a6a6b0] uppercase">
                      <span aria-hidden="true" className="text-[0.75em] text-[#8e8e98]">
                        ✦
                      </span>
                      <span>Bối Cảnh</span>
                      <span aria-hidden="true" className="text-[0.75em] text-[#8e8e98]">
                        ✦
                      </span>
                    </span>
                    <div className="h-px flex-1 max-w-[18cqw] bg-gradient-to-l from-transparent to-zinc-600/70" />
                  </div>

                  <p className="font-serif-title mx-auto max-w-[94%] text-[3.4cqw] leading-[1.78] font-light italic text-[#d8d8e0]">
                    “{character.backgroundContext || character.quote}”
                  </p>
                </div>
              )}

              {/* Chalk-Print Hairline Divider with Enlarged 4-Pointed Star */}
              <div
                aria-hidden="true"
                className="mx-auto mt-[6cqw] flex w-4/5 items-center justify-center gap-[3.5cqw]"
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-700/70" />
                <span className="text-[3cqw] leading-none text-[#8e8e98]">
                  ✦
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-700/70" />
              </div>
            </div>

            {/* 3. Story Content (Harmonized in Cormorant Garamond Serif & Chalk-Silver Tone to Match Bối Cảnh — Justified on Both Sides & 1:1 cqw) */}
            <div className="px-[2cqw]">
              <div
                className="font-serif-title space-y-[4cqw] text-justify text-[3.6cqw] leading-[1.82] font-normal text-[#dcdce4]"
                style={{ textAlign: 'justify', textAlignLast: 'left' }}
              >
                {storyParagraphs.map((paragraph, idx) => {
                  const isDivider = paragraph === '***' || paragraph === '* * *';
                  if (isDivider) {
                    return (
                      <div
                        key={idx}
                        aria-hidden="true"
                        className="gothic-chalk-print flex items-center justify-center gap-[3.2cqw] py-[2.2cqw] text-[2.8cqw] tracking-[0.4em] text-[#8e8e98] select-none"
                      >
                        <span>✦</span>
                        <span>✦</span>
                        <span>✦</span>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-justify">
                      {renderFormattedParagraph(paragraph)}
                    </p>
                  );
                })}
              </div>

              {/* Closing Tailpiece Ornament */}
              <div
                aria-hidden="true"
                className="gothic-chalk-print mt-[8cqw] flex items-center justify-center gap-[3cqw]"
              >
                <span className="h-px w-[12cqw] bg-gradient-to-r from-transparent to-zinc-700/70" />
                <span className="text-[2.8cqw] text-[#8e8e98]">✦</span>
                <span className="h-px w-[12cqw] bg-gradient-to-l from-transparent to-zinc-700/70" />
              </div>
            </div>

            {(character.relationships.length > 0 ||
              character.trinkets.length > 0) && <GothicCrossDivider />}

            {character.relationships.length > 0 && (
              <div className="px-[2.5cqw]">
                <h3 className="text-center font-serif-title text-[2.7cqw] tracking-widest text-zinc-400 uppercase">
                  Mối Quan Hệ & Liên Kết
                </h3>
                <div className="mt-[3cqw] space-y-[2.5cqw]">
                  {character.relationships.map((rel, idx) => (
                    <div
                      key={idx}
                      className="border-b border-zinc-800/70 pb-[2.8cqw] text-center"
                    >
                      <div className="flex items-center justify-center gap-[1.8cqw] text-[2.8cqw]">
                        <span className="font-semibold text-zinc-100">
                          {rel.name}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="italic text-zinc-400">
                          {rel.relation}
                        </span>
                      </div>
                      <p className="mt-[1cqw] text-[2.8cqw] text-zinc-300">{rel.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {character.trinkets.length > 0 && (
              <div className="px-[2.5cqw]">
                <h3 className="text-center font-serif-title text-[2.7cqw] tracking-widest text-zinc-400 uppercase">
                  Di Vật & Kỷ Vật Mang Theo
                </h3>
                <ul className="mt-[2.5cqw] space-y-[2cqw] text-[3.1cqw] text-zinc-300">
                  {character.trinkets.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-baseline justify-center gap-[2.8cqw] border-b border-zinc-800/60 pb-[1.5cqw]"
                    >
                      <span className="font-tabular text-[2.7cqw] text-zinc-500">
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
