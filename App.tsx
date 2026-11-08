import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import {
  INITIAL_CHARACTERS,
  CharacterProfile,
  RealmId,
  ImageCropConfig,
} from './data/cemeteryData';
import { SnowAndMistCanvas } from './components/SnowAndMistCanvas';
import {
  GothicArchHeaderOrnament,
  GothicFilmGrainOverlay,
  GothicLayeredEntranceBackdrop,
} from './components/GothicOrnaments';
import { AuthenticPhotoFrame } from './components/AuthenticPhotoFrame';
import { AddCharacterModal } from './components/AddCharacterModal';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { RealmIntroSection } from './components/RealmIntroSection';
import { AudioProvider } from './context/AudioContext';
import { BackgroundMusicWidget } from './components/BackgroundMusicWidget';

const STORAGE_KEY_CHARS = 'runga_da_xam_char_profiles_v19';

function AppContent() {
  const [activeView, setActiveView] = useState<'entrance' | RealmId>('entrance');

  const [characters, setCharacters] = useState<CharacterProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHARS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any canonical characters from INITIAL_CHARACTERS that might be missing or updated
          const existingIds = new Set(parsed.map((p: CharacterProfile) => p.id));
          const missingDefaults = INITIAL_CHARACTERS.filter((initChar) => !existingIds.has(initChar.id));
          const updated = parsed.map((p: CharacterProfile) => {
            const match = INITIAL_CHARACTERS.find((init) => init.id === p.id);
            if (match && !p.isCustom) {
              return {
                ...match,
                ...p,
                role: match.role,
                name: match.name,
                alias: match.alias,
                quote: match.quote,
                appearance: match.appearance,
                personality: match.personality,
                age: match.age,
                height: match.height,
                affiliations: match.affiliations,
                avatar: match.avatar,
                promptLink: match.promptLink,
                backgroundContext: match.backgroundContext,
              };
            }
            return p;
          });
          return [...updated, ...missingDefaults];
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_CHARACTERS;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterProfile | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHARS, JSON.stringify(characters));
    } catch {
      // ignore
    }
  }, [characters]);

  const handleAddCharacter = (newChar: CharacterProfile) => {
    setCharacters((prev) => [newChar, ...prev]);
  };

  const handleUpdateAvatar = (charId: string, newAvatar: ImageCropConfig) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id !== charId) return c;
        const updated = { ...c, avatar: newAvatar };
        if (selectedCharacter?.id === charId) {
          setSelectedCharacter(updated);
        }
        return updated;
      })
    );
  };

  const handleAppendPhotoToCharacter = (
    charId: string,
    newPhoto: ImageCropConfig
  ) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id !== charId) return c;
        const updated = {
          ...c,
          gallery: [...c.gallery, newPhoto],
        };
        if (selectedCharacter?.id === charId) {
          setSelectedCharacter(updated);
        }
        return updated;
      })
    );
  };

  const handleDeleteCharacter = (charId: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== charId));
  };

  const enterRealm = (realm: RealmId) => {
    setSearchQuery('');
    setActiveView(realm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= VIEW 1: MÀN HÌNH CHÍNH (GOTHIC UNIFIED FRAME + HARMONIZED ENGRAVED CENTERPIECE) =================
  if (activeView === 'entrance') {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#030304] text-zinc-100">
        {/* Multi-Layered Unified Gothic Frame, Film Grain & Dust */}
        <GothicLayeredEntranceBackdrop />

        {/* Subtle Floating Dust Motes Only (mistEnabled={false} so background stays deep Gothic black, not grey) */}
        <SnowAndMistCanvas
          snowIntensity="gentle"
          mistEnabled={false}
          spectralMotionEnabled={false}
        />

        {/* Cohesive, Uncluttered Gothic Centerpiece Harmonized with the Outer Frame */}
        <main className="entrance-container gothic-chalk-print relative z-20 mx-auto flex w-full flex-col items-center text-center">
          {/* 1. Stippled Botanical Crest Matching the 4 Frame Corners */}
          <GothicArchHeaderOrnament className="entrance-crest opacity-95" />

          {/* 2. Category Overline ("Nghĩa Trang") */}
          <div className="entrance-overline flex items-center justify-center font-serif-title font-medium text-[#e4e4eb] uppercase">
            <span aria-hidden="true" className="text-[0.7em] text-[#c4c4cc]">
              ✦
            </span>
            <span>Nghĩa Trang</span>
            <span aria-hidden="true" className="text-[0.7em] text-[#c4c4cc]">
              ✦
            </span>
          </div>

          {/* 3. Proper Cemetery Name ("Cổ Rừng Đá Xám") — Single Line Always, Beautifully Scaled */}
          <h1 className="font-serif-title entrance-title whitespace-nowrap font-normal text-[#e6e6ec] uppercase">
            Cổ Rừng Đá Xám
          </h1>

          {/* 4. Delicate Tapered Hairline & 4-Pointed Star Divider */}
          <div
            aria-hidden="true"
            className="entrance-divider flex w-full items-center justify-center text-[#c8c8ce]/80"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#a1a1aa]/55 to-[#d8d8de]/85" />
            <span className="text-[0.85em] leading-none text-[#d8d8de]">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#a1a1aa]/55 to-[#d8d8de]/85" />
          </div>

          {/* 5. Original Literary Quote — Clearly Legible, Large on Web, Harmonious Spacing */}
          <p className="entrance-quote font-serif-title font-light italic text-[#dedee5]">
            “Nơi sương mù khâu lại những vết sẹo của thời gian, và tuyết trắng
            chôn vùi những cái tên chưa từng được gọi thành lời.”
          </p>

          {/* 6. Two Original Realm Buttons ("Rừng Cổ Tích" & "Rừng Sương Đen") */}
          <div className="entrance-buttons-wrap flex flex-wrap items-center justify-center">
            <button
              type="button"
              onClick={() => enterRealm('rung-co-tich')}
              className="entrance-button group relative cursor-pointer whitespace-nowrap border border-[#c8c8ce]/55 bg-[#050507]/85 transition-all duration-300 hover:border-[#ececef] hover:bg-[#111115]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[2.5px] border border-[#a1a1aa]/30 transition-colors duration-300 group-hover:border-[#d4d4d8]/60 md:inset-[3.5px]"
              />
              <span className="entrance-button-text relative z-10 flex items-center justify-center font-serif-title font-normal text-[#e4e4ea] uppercase group-hover:text-white">
                <span className="text-[0.75em] text-[#a1a1aa] transition-transform duration-300 group-hover:scale-125 group-hover:text-white">
                  ✦
                </span>
                <span>Rừng Cổ Tích</span>
                <span className="text-[0.75em] text-[#a1a1aa] transition-transform duration-300 group-hover:scale-125 group-hover:text-white">
                  ✦
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => enterRealm('rung-ben-phai')}
              className="entrance-button group relative cursor-pointer whitespace-nowrap border border-[#c8c8ce]/55 bg-[#050507]/85 transition-all duration-300 hover:border-[#ececef] hover:bg-[#111115]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[2.5px] border border-[#a1a1aa]/30 transition-colors duration-300 group-hover:border-[#d4d4d8]/60 md:inset-[3.5px]"
              />
              <span className="entrance-button-text relative z-10 flex items-center justify-center font-serif-title font-normal text-[#e4e4ea] uppercase group-hover:text-white">
                <span className="text-[0.75em] text-[#a1a1aa] transition-transform duration-300 group-hover:scale-125 group-hover:text-white">
                  ✦
                </span>
                <span>Rừng Điển Tích</span>
                <span className="text-[0.75em] text-[#a1a1aa] transition-transform duration-300 group-hover:scale-125 group-hover:text-white">
                  ✦
                </span>
              </span>
            </button>
          </div>
        </main>
      </div>
    );
  }

// Helper to remove Vietnamese diacritics for flexible fuzzy matching
function removeVietnameseDiacritics(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

function hasVietnameseDiacritics(str: string): boolean {
  return /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(
    str
  );
}

  // ================= VIEW 2: TRANG KHU RỪNG (MỞ ĐẦU BẰNG LAYOUT ĐĨA THAN & ẢNH CÔ GÁI -> DANH SÁCH CHAR) =================
  const isLeftRealm = activeView === 'rung-co-tich';
  const activeRealmTitle = isLeftRealm ? 'Rừng Cổ Tích' : 'Rừng Điển Tích';

  const allRealmCharacters = characters.filter((c) => c.realm === activeView);

  const realmCharacters = allRealmCharacters.filter((char, index) => {
    const rawQuery = searchQuery.trim();
    if (!rawQuery) return true;

    const queryLower = rawQuery.toLowerCase();
    const queryClean = removeVietnameseDiacritics(rawQuery);
    const isAccented = hasVietnameseDiacritics(rawQuery);

    // 1. Check card index aliases (No. 01, No 1, 01, 1, char 1, etc.)
    const num = index + 1;
    const numStr = String(num);
    const numPadded = num < 10 ? `0${num}` : numStr;
    const indexAliases = [
      numStr,
      numPadded,
      `no ${numStr}`,
      `no. ${numStr}`,
      `no ${numPadded}`,
      `no. ${numPadded}`,
      `char ${numStr}`,
      `char ${numPadded}`,
      `char${numStr}`,
      `char${numPadded}`,
      `so ${numStr}`,
      `so ${numPadded}`,
      `so. ${numStr}`,
      `so. ${numPadded}`,
    ];

    if (indexAliases.includes(queryClean) || indexAliases.includes(queryLower)) {
      return true;
    }

    // 2. Character metadata fields (name, alias, role, settings, tags, quote, context - strictly excluding 5000-word story to prevent cross-character false positives)
    const searchableFields = [
      char.name,
      char.alias,
      char.role,
      char.age,
      char.height,
      char.affiliations,
      char.appearance,
      char.personality,
      char.quote,
      char.backgroundContext || '',
      char.promptLink?.text || '',
      ...(char.trinkets || []),
    ].filter(Boolean);

    // Exact or substring match in any field
    for (const field of searchableFields) {
      const fLower = field.toLowerCase();
      if (isAccented) {
        if (fLower.includes(queryLower)) return true;
      } else {
        const fClean = removeVietnameseDiacritics(field);
        if (fClean.includes(queryClean)) {
          // If query is short (<= 4 chars like "than"), prevent matching unrelated words like "thanh" / "thang"
          if (queryClean.length <= 4) {
            const words = fClean.split(/[\s,./•·×\-_:"'“”]+/).filter(Boolean);
            if (
              words.some(
                (w) =>
                  w === queryClean ||
                  (w.startsWith(queryClean) &&
                    !w.startsWith(queryClean + 'h') &&
                    !w.startsWith(queryClean + 'g'))
              )
            ) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
    }

    // Multi-token match: all words in query must match within character metadata
    const tokens = isAccented
      ? queryLower.split(/\s+/).filter(Boolean)
      : queryClean.split(/\s+/).filter(Boolean);

    if (tokens.length > 1) {
      const combinedText = isAccented
        ? searchableFields.join(' ').toLowerCase()
        : removeVietnameseDiacritics(searchableFields.join(' '));

      const allTokensMatch = tokens.every((tok) => {
        if (isAccented) {
          return combinedText.includes(tok);
        }
        if (tok.length <= 4) {
          const words = combinedText
            .split(/[\s,./•·×\-_:"'“”]+/)
            .filter(Boolean);
          return words.some(
            (w) =>
              w === tok ||
              (w.startsWith(tok) &&
                !w.startsWith(tok + 'h') &&
                !w.startsWith(tok + 'g'))
          );
        }
        return combinedText.includes(tok);
      });

      if (allTokensMatch) return true;
    }

    return false;
  });

  return (
    <div className="relative min-h-screen bg-[#030304] text-[#e5e5e5]">
      {/* Analog Film Grain & Chalk Dust Overlay Inside Realm Views */}
      <GothicFilmGrainOverlay />

      {/* Continuous Snowfall Only (mistEnabled={false} so background stays pure deep Gothic black) */}
      <SnowAndMistCanvas
        snowIntensity="moderate"
        mistEnabled={false}
        spectralMotionEnabled={false}
      />

      {/* PHẦN MỞ ĐẦU TRƯỚC KHI TỚI DANH SÁCH CHAR (ĐÚNG NHƯ ẢNH CANVA CỦA USER) */}
      <div className="relative z-10">
        <RealmIntroSection
          realm={activeView}
          onBackToGate={() => setActiveView('entrance')}
          onSwitchRealm={(target) => enterRealm(target)}
        />
      </div>

      {/* PHẦN VĂN BIA LINH HỒN PHÍA DƯỚI — ĐỒNG NHẤT 100% VỚI PHONG CÁCH CANVA TRÊN */}
      <main className="relative z-10 mx-auto max-w-[560px] px-4 pt-6 pb-24 sm:w-[92%] sm:max-w-[880px] sm:px-6 sm:pt-12 sm:pb-32">
        {/* Tiêu đề & Thanh công cụ Văn Bia Nghĩa Trang đồng bộ style Canva */}
        <div className="mb-8 flex flex-col items-center text-center sm:mb-12">
          <div className="mb-3 flex items-center justify-center sm:mb-4">
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

          <h2 className="font-hp001 text-[23px] leading-[1.45] font-normal text-[#ededed] sm:text-[48px]">
            biên niên sử cổ
          </h2>
          <p className="font-sans-clean mt-2 text-[10px] tracking-[0.06em] text-[#a8a8a8] uppercase sm:mt-3.5 sm:text-[18px] sm:tracking-[0.08em]">
            {searchQuery.trim()
              ? `${activeRealmTitle} · Tìm thấy ${realmCharacters.length} linh hồn khớp với “${searchQuery.trim()}”`
              : `${activeRealmTitle} · ${realmCharacters.length} linh hồn an nghỉ`}
          </p>

          <div className="mt-5 flex w-full flex-col items-stretch justify-between gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-[#8c8c8c] sm:left-5 sm:h-5 sm:w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Tìm kiếm văn bia trong ${activeRealmTitle}...`}
                className="font-sans-clean w-full rounded-full border border-white/15 bg-[#08080a] py-2 pr-9 pl-9 text-[11px] text-[#e5e5e5] placeholder:text-[#787878] focus:border-white/40 focus:outline-none sm:py-4 sm:pr-12 sm:pl-13 sm:text-[18px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-xs text-[#888888] hover:text-white sm:right-4 sm:text-base cursor-pointer"
                  title="Xóa tìm kiếm"
                  aria-label="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Khung trang trí nghĩa trang (thay thế nút thêm nhân vật) */}
            <div className="font-sans-clean inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/20 bg-[#08080a] px-4 py-2 text-[11px] tracking-[0.05em] text-[#dcdcdc] select-none shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:gap-2.5 sm:px-7 sm:py-4 sm:text-[18px]">
              <span className="text-[9px] text-[#888888] sm:text-[13px]">✦</span>
              <span>Yên Giấc Ngàn Thu</span>
              <span className="text-[9px] text-[#888888] sm:text-[13px]">✦</span>
            </div>
          </div>
        </div>

        {/* Character Cards List Unified with Deep Pitch-Black Layout */}
        <section className="space-y-6 sm:space-y-10">
          {realmCharacters.length === 0 ? (
            <div className="border border-white/10 bg-[#070709] p-8 text-center sm:p-12">
              <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[#a8a8a8]">
                ✦
              </div>
              <h3 className="font-serif-title text-lg tracking-[0.08em] text-[#e6e6ec] uppercase sm:text-2xl">
                Không tìm thấy văn bia phù hợp
              </h3>
              <p className="font-sans-clean mt-2 text-[11px] text-[#9a9a9a] sm:text-base">
                Không có linh hồn nào khớp với từ khóa “{searchQuery}” trong{' '}
                {activeRealmTitle}.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="font-sans-clean mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/25 bg-[#111115] px-4 py-1.5 text-[11px] text-[#e5e5e5] hover:border-white/50 hover:bg-[#18181f] sm:text-sm"
              >
                <span>✕</span>
                <span>Xóa bộ lọc tìm kiếm</span>
              </button>
            </div>
          ) : (
            realmCharacters.map((char) => {
              const canonicalIndex =
                allRealmCharacters.findIndex((c) => c.id === char.id) + 1;
              const formattedNo =
                canonicalIndex < 10
                  ? `No. 0${canonicalIndex}`
                  : `No. ${canonicalIndex}`;

              return (
                <article
                  key={char.id}
                  onClick={() => setSelectedCharacter(char)}
                  className="group relative cursor-pointer border border-white/10 bg-[#070709] p-4 transition-all duration-300 hover:border-white/25 hover:bg-[#0c0c0f] sm:border-white/15 sm:p-9"
                >
                  <div className="font-sans-clean flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 text-[10px] tracking-[0.06em] text-[#9e9e9e] uppercase sm:border-white/15 sm:pb-4.5 sm:text-[16.5px] sm:tracking-[0.07em]">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <span className="font-tabular text-[#dcdcdc]">
                        {formattedNo}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-[6px] text-zinc-500 sm:text-[8px]"
                      >
                        ●
                      </span>
                      <span className="text-[#cccccc]">
                        {char.role
                          ? char.role.charAt(0).toUpperCase() +
                            char.role.slice(1)
                          : ''}
                      </span>
                    </div>
                    <span>{activeRealmTitle}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-5 sm:mt-7 sm:grid-cols-12 sm:gap-9">
                    {/* Portrait */}
                    <div className="sm:col-span-5">
                      <div className="aspect-square w-full overflow-hidden bg-[#101010]">
                        <AuthenticPhotoFrame
                          image={char.avatar}
                          alt={char.name}
                          spectralMotion={false}
                          preserveColor={true}
                          className="h-full w-full"
                        />
                      </div>

                      {char.gallery.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2.5">
                          {char.gallery.slice(0, 3).map((gImg, gIdx) => (
                            <div
                              key={gIdx}
                              className="aspect-square overflow-hidden bg-[#101010]"
                            >
                              <AuthenticPhotoFrame
                                image={gImg}
                                alt={`${char.name} ${gIdx + 1}`}
                                spectralMotion={false}
                                preserveColor={true}
                                className="h-full w-full opacity-80 transition-opacity group-hover:opacity-100"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Lore & Bio */}
                    <div className="flex flex-col justify-between text-left sm:col-span-7">
                      <div>
                        <h3 className="gothic-chalk-print font-serif-title text-xl leading-tight font-normal tracking-[0.11em] text-[#e6e6ec] uppercase sm:text-[40px] sm:tracking-[0.13em]">
                          {char.name}
                        </h3>
                        <p className="font-serif-title mt-1.5 text-[13px] font-light italic text-[#d0d0d6] sm:mt-2.5 sm:text-[23px]">
                          “{char.alias}”
                        </p>

                        <div className="font-sans-clean mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-y border-white/10 py-2 text-[10.5px] text-[#cccccc] sm:mt-5 sm:gap-x-3.5 sm:border-white/15 sm:py-3.5 sm:text-[17.5px]">
                          <span>{char.age}</span>
                          <span
                            aria-hidden="true"
                            className="text-[6px] text-zinc-500 sm:text-[8px]"
                          >
                            ●
                          </span>
                          <span>{char.height}</span>
                        </div>

                        <blockquote className="font-sans-clean mt-3.5 text-[11.5px] leading-[1.65] font-light italic text-[#dcdcdc] sm:mt-5 sm:text-[19.5px] sm:leading-[1.72]">
                          {char.quote}
                        </blockquote>
                      </div>

                      <div className="font-sans-clean mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10.5px] sm:mt-7 sm:border-white/15 sm:pt-4.5 sm:text-[17px]">
                        <span className="text-[#999999]">
                          {char.trinkets.length > 0
                            ? `Di vật: ${char.trinkets.length} món`
                            : char.role
                            ? char.role.charAt(0).toUpperCase() +
                              char.role.slice(1)
                            : ''}
                        </span>
                        <span className="font-normal tracking-[0.04em] text-[#e5e5e5] uppercase underline-offset-4 group-hover:underline">
                          Đọc Văn Bia →
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* Ba khung liên kết ở đáy trang trong — Đồng bộ 100% style 2 khung ngoài màn hình chính */}
        <footer
          aria-label="Liên kết lối đi"
          className="mt-10 border-t border-white/10 pt-8 sm:mt-16 sm:border-white/15 sm:pt-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
            <a
              href="https://discord.gg/silvestre"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap border border-[#c8c8ce]/60 bg-[#050507]/90 px-4 py-2.5 transition-all duration-300 hover:border-[#ececef] hover:bg-[#111115] sm:w-full sm:px-3 sm:py-4"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[2.5px] border border-[#a1a1aa]/35 transition-colors duration-300 group-hover:border-[#d4d4d8]/65 sm:inset-[3.5px]"
              />
              <span className="relative z-10 flex items-center justify-center gap-1.5 font-serif-title text-[9.5px] font-normal tracking-[0.11em] text-[#e4e4ea] uppercase group-hover:text-white sm:gap-2 sm:text-[13.5px] sm:tracking-[0.09em]">
                <span className="text-[0.75em] text-[#a1a1aa] transition-transform duration-300 group-hover:scale-125 group-hover:text-white">
                  ✦
                </span>
                <span>Lối Vào Nhà Nguyện</span>
                <span className="text-[0.75em] text-[#a1a1aa] transition-transform duration-300 group-hover:scale-125 group-hover:text-white">
                  ✦
                </span>
              </span>
            </a>

            <a
              href="https://www.facebook.com/share/1BtPATbjBP/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap border border-[#c8c8ce]/60 bg-[#050507]/90 px-4 py-2.5 transition-all duration-300 hover:border-[#ececef] hover:bg-[#111115] sm:w-full sm:px-3 sm:py-4"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[2.5px] border border-[#a1a1aa]/35 transition-colors duration-300 group-hover:border-[#d4d4d8]/65 sm:inset-[3.5px]"
              />
              <span className="relative z-10 flex items-center justify-center gap-1.5 font-serif-title text-[9.5px] font-normal tracking-[0.11em] text-[#e4e4ea] uppercase group-hover:text-white sm:gap-2 sm:text-[13.5px] sm:tracking-[0.09em]">
                <span className="text-[0.75em] text-[#a1a1aa] transition-transform duration-300 group-hover:scale-125 group-hover:text-white">
                  ✦
                </span>
                <span>Lối Xuống Triền Đông</span>
                <span className="text-[0.75em] text-[#a1a1aa] transition-transform duration-300 group-hover:scale-125 group-hover:text-white">
                  ✦
                </span>
              </span>
            </a>

            <a
              href="https://www.facebook.com/share/14tECa77VWj/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap border border-[#c8c8ce]/60 bg-[#050507]/90 px-4 py-2.5 transition-all duration-300 hover:border-[#ececef] hover:bg-[#111115] sm:w-full sm:px-3 sm:py-4"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[2.5px] border border-[#a1a1aa]/35 transition-colors duration-300 group-hover:border-[#d4d4d8]/65 sm:inset-[3.5px]"
              />
              <span className="relative z-10 flex items-center justify-center gap-1.5 font-serif-title text-[9.5px] font-normal tracking-[0.11em] text-[#e4e4ea] uppercase group-hover:text-white sm:gap-2 sm:text-[13.5px] sm:tracking-[0.09em]">
                <span className="text-[0.75em] text-[#a1a1aa] transition-transform duration-300 group-hover:scale-125 group-hover:text-white">
                  ✦
                </span>
                <span>Lối Lên Bóng Nàng</span>
                <span className="text-[0.75em] text-[#a1a1aa] transition-transform duration-300 group-hover:scale-125 group-hover:text-white">
                  ✦
                </span>
              </span>
            </a>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <AddCharacterModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCharacter={handleAddCharacter}
        defaultRealm={activeView}
        rightForestName="Rừng Điển Tích"
      />

      <CharacterDetailModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
        onUpdateAvatar={handleUpdateAvatar}
        onAppendPhotoToCharacter={handleAppendPhotoToCharacter}
        onDeleteCharacter={handleDeleteCharacter}
        rightForestName="Rừng Điển Tích"
      />
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <AppContent />
      <BackgroundMusicWidget />
    </AudioProvider>
  );
}
