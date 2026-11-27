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
  GothicTwinStarIcon,
} from './components/GothicOrnaments';
import { AuthenticPhotoFrame } from './components/AuthenticPhotoFrame';
import { AddCharacterModal } from './components/AddCharacterModal';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { RealmIntroSection } from './components/RealmIntroSection';
import { GatekeeperIntroView } from './components/GatekeeperIntroView';
import { AudioProvider } from './context/AudioContext';
import { BackgroundMusicWidget } from './components/BackgroundMusicWidget';
import {
  subscribeToCharacterTributes,
  syncVisitorOfferedStatus,
  recordUniqueFlowerOffering,
} from './firebase';

const STORAGE_KEY_CHARS = 'runga_da_xam_char_profiles_v19';
const STORAGE_KEY_FLOWERS = 'runga_da_xam_flower_tributes_v2';
const STORAGE_KEY_OFFERED = 'runga_da_xam_offered_map_v2';

function WhiteChrysanthemumIcon({
  className = 'h-4 w-4',
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* 8 delicate chrysanthemum petals */}
      <path
        d="M12 2.2C13.1 5.2 13.4 7.5 12 9.5C10.6 7.5 10.9 5.2 12 2.2Z"
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity={filled ? '0.28' : '0'}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21.8C13.1 18.8 13.4 16.5 12 14.5C10.6 16.5 10.9 18.8 12 21.8Z"
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity={filled ? '0.28' : '0'}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.2 12C5.2 10.9 7.5 10.6 9.5 12C7.5 13.4 5.2 13.1 2.2 12Z"
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity={filled ? '0.28' : '0'}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.8 12C18.8 10.9 16.5 10.6 14.5 12C16.5 13.4 18.8 13.1 21.8 12Z"
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity={filled ? '0.28' : '0'}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.07 5.07C7.97 6.41 9.81 7.82 10.23 10.23C7.82 9.81 6.41 7.97 5.07 5.07Z"
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity={filled ? '0.22' : '0'}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.93 18.93C16.03 17.59 14.19 16.18 13.77 13.77C16.18 14.19 17.59 16.03 18.93 18.93Z"
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity={filled ? '0.22' : '0'}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.93 5.07C17.59 7.97 16.18 9.81 13.77 10.23C14.19 7.82 16.03 6.41 18.93 5.07Z"
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity={filled ? '0.22' : '0'}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.07 18.93C6.41 16.03 7.82 14.19 10.23 13.77C9.81 16.18 7.97 17.59 5.07 18.93Z"
        fill={filled ? 'currentColor' : 'none'}
        fillOpacity={filled ? '0.22' : '0'}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.2"
        fill={filled ? 'currentColor' : '#070709'}
        stroke="currentColor"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function AppContent() {
  const [activeView, setActiveView] = useState<
    'entrance' | 'gatekeeper' | RealmId
  >('entrance');

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

  const [flowerCounts, setFlowerCounts] = useState<Record<string, number>>(
    () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_FLOWERS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
      return {};
    }
  );

  const [offeredMap, setOfferedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFFERED);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [justOfferedCharId, setJustOfferedCharId] = useState<string | null>(
    null
  );
  const [lockedNoticeCharId, setLockedNoticeCharId] = useState<string | null>(
    null
  );

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FLOWERS, JSON.stringify(flowerCounts));
    } catch {
      // ignore
    }
  }, [flowerCounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OFFERED, JSON.stringify(offeredMap));
    } catch {
      // ignore
    }
  }, [offeredMap]);

  useEffect(() => {
    const charIds = characters.map((c) => c.id);
    const unsubscribe = subscribeToCharacterTributes(
      charIds,
      (charId, remoteCount) => {
        setFlowerCounts((prev) => ({
          ...prev,
          [charId]: remoteCount,
        }));
      }
    );

    syncVisitorOfferedStatus(charIds, (confirmedCharId) => {
      setOfferedMap((prev) => {
        if (prev[confirmedCharId]) return prev;
        return { ...prev, [confirmedCharId]: true };
      });
    });

    return () => unsubscribe();
  }, [characters]);

  const handleOfferFlower = (e: React.MouseEvent, charId: string) => {
    e.stopPropagation();

    setJustOfferedCharId(charId);
    window.setTimeout(() => {
      setJustOfferedCharId((prev) => (prev === charId ? null : prev));
    }, 650);

    // Clear locked notice if active on this character
    if (lockedNoticeCharId === charId) {
      setLockedNoticeCharId(null);
    }

    // If this visitor already placed a flower on this character, do not add fake likes
    if (offeredMap[charId]) {
      return;
    }

    setOfferedMap((prev) => ({
      ...prev,
      [charId]: true,
    }));

    setFlowerCounts((prev) => ({
      ...prev,
      [charId]: (prev[charId] || 0) + 1,
    }));

    recordUniqueFlowerOffering(charId)
      .then(({ alreadyOffered }) => {
        if (alreadyOffered) {
          // Visitor already existed in Firestore (e.g. returning via IP fingerprint after clearing cache);
          // undo the optimistic +1 so count stays strictly 1 per unique visitor.
          setFlowerCounts((prev) => ({
            ...prev,
            [charId]: Math.max(1, (prev[charId] || 1) - 1),
          }));
        }
      })
      .catch((err) => {
        console.warn('Could not persist flower offering to Firestore:', err);
      });
  };

  const handleTryOpenCharacter = (char: CharacterProfile) => {
    if (!offeredMap[char.id]) {
      setLockedNoticeCharId(char.id);
      window.setTimeout(() => {
        setLockedNoticeCharId((prev) => (prev === char.id ? null : prev));
      }, 3600);
      return;
    }
    setSelectedCharacter(char);
  };

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

        {/* Cohesive, Uncluttered Gothic Centerpiece Harmonized with the Inner Pages' Matte Silver-Ash Chalk Palette */}
        <main className="entrance-container relative z-20 mx-auto flex w-full flex-col items-center text-center">
          {/* 1. Stippled Botanical Crest Matching the 4 Frame Corners & Inner Ornaments */}
          <GothicArchHeaderOrnament className="entrance-crest gothic-chalk-print opacity-88" />

          {/* 2. Category Overline ("Nghĩa Trang") */}
          <div className="entrance-overline gothic-text-chalk flex items-center justify-center font-serif-title font-medium text-[#b8b8c2] uppercase">
            <span aria-hidden="true" className="text-[0.7em] text-[#9a9aa4]">
              ✦
            </span>
            <span>Nghĩa Trang</span>
            <span aria-hidden="true" className="text-[0.7em] text-[#9a9aa4]">
              ✦
            </span>
          </div>

          {/* 3. Proper Cemetery Name ("Cổ Rừng Đá Xám") — Matched 1:1 with Inner Matte Silver-Ash Chalk Filter */}
          <h1 className="font-serif-title gothic-time-chalk entrance-title whitespace-nowrap font-normal uppercase">
            Cổ Rừng Đá Xám
          </h1>

          {/* 4. Delicate Tapered Hairline & 4-Pointed Star Divider */}
          <div
            aria-hidden="true"
            className="entrance-divider gothic-chalk-print flex w-full items-center justify-center text-[#b0b0ba]/80"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#9898a2]/45 to-[#b8b8c2]/75" />
            <span className="text-[0.85em] leading-none text-[#b4b4be]">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#9898a2]/45 to-[#b8b8c2]/75" />
          </div>

          {/* 5. Original Literary Quote — Synchronized Chalk-Ash Tone with Inner Quotes */}
          <p className="entrance-quote gothic-text-chalk font-serif-title font-light italic text-[#b8b8c2]">
            “Nơi sương mù khâu lại những vết sẹo của thời gian, và tuyết trắng
            chôn vùi những cái tên chưa từng được gọi thành lời.”
          </p>

          {/* 6. Single Entrance Button ("BƯỚC VÀO NGHĨA TRANG") */}
          <div className="entrance-buttons-wrap gothic-chalk-print flex flex-wrap items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setActiveView('gatekeeper');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="entrance-button group relative cursor-pointer whitespace-nowrap border border-[#b4b4be]/50 bg-[#050507]/85 transition-all duration-300 hover:border-[#dcdce4] hover:bg-[#111115]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[calc(var(--u)*0.65)] border border-[#9898a2]/28 transition-colors duration-300 group-hover:border-[#c8c8d2]/55"
              />
              <span className="entrance-button-text relative z-10 flex items-center justify-center font-serif-title font-normal text-[#c8c8d2] uppercase group-hover:text-[#ececf2]">
                <span className="text-[0.75em] text-[#9898a2] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#ececf2]">
                  ✦
                </span>
                <span>Bước Vào Nghĩa Trang</span>
                <span className="text-[0.75em] text-[#9898a2] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#ececf2]">
                  ✦
                </span>
              </span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ================= VIEW 2: TRANG GIỚI THIỆU NGƯỜI GÁC CỔNG =================
  if (activeView === 'gatekeeper') {
    return (
      <GatekeeperIntroView
        onBackToEntrance={() => {
          setActiveView('entrance');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onEnterRealm={(targetRealm) => enterRealm(targetRealm)}
      />
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
      {/* Identical Analog Film Grain & Chalk Dust Overlay as Outer Entrance Screen */}
      <GothicFilmGrainOverlay />

      {/* Original Continuous Snowfall Preserved 100% */}
      <SnowAndMistCanvas
        snowIntensity="moderate"
        mistEnabled={false}
        spectralMotionEnabled={false}
      />

      {/* KHUNG VÒM GOTHIC CỔ ĐIỂN ĐỒNG BỘ MÀU BẠC PHẤN (#E2E2E6) & HIỆU ỨNG NHIỄU HẠT — DÙNG CONTAINER QUERY (cqw) ĐỒNG BỘ TỶ LỆ 1:1 MOBILE & WEB/DEVICE */}
      <div className="relative z-10 mx-auto my-1.5 min-h-[calc(100vh-12px)] w-[calc(100%-4px)] max-w-[940px] overflow-hidden [container-type:inline-size]">
        {/* Cấu trúc Vòm Gothic 3 nhịp — Cột xoắn thả lửng — Thân cột mảnh — Chân đế hoa văn nối liền mạch */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex flex-col opacity-92"
        >
          {/* 1. Toàn bộ vòm Gothic & cột xoắn thả lửng nguyên bản */}
          <div className="relative w-full shrink-0">
            <img
              src="/assets/aistudio/gothic_cathedral_arch_top.png?v=12"
              alt=""
              referrerPolicy="no-referrer"
              className="block h-auto w-full select-none"
            />
          </div>

          {/* 2. Thân cột mảnh hai bên nối liền mạch xuống chân khung */}
          <div
            className="w-full flex-1"
            style={{
              backgroundImage:
                "url('/assets/aistudio/gothic_cathedral_pillars_row.png?v=12')",
              backgroundSize: '100% auto',
              backgroundPosition: 'top center',
              backgroundRepeat: 'repeat-y',
            }}
          />

          {/* 3. Chân đế hoa văn cổ điển ở đáy trang */}
          <img
            src="/assets/aistudio/gothic_cathedral_bottom.png?v=12"
            alt=""
            referrerPolicy="no-referrer"
            className="block h-auto w-full shrink-0 select-none"
          />
        </div>

        {/* NỬA TRÊN: BƯỚM ĐÊM, KHUNG BAROQUE + FONT LF PUSHKIN, HOA VĂN NGHĨA TRANG, CHÌA KHÓA CỔ & ĐIỀU HƯỚNG */}
        <div className="relative z-20">
          <RealmIntroSection
            realm={activeView}
            onBackToGate={() => {
              setActiveView('gatekeeper');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchRealm={(target) => enterRealm(target)}
          />
        </div>

        {/* NỬA DƯỚI: GỬI NGƯỜI VIẾNG THĂM -> HƯỚNG DẪN -> KIẾM NGANG -> BIÊN NIÊN SỬ (NHỊP THƯA EDITORIAL 1:1 cqw) */}
        <main className="relative z-20 mx-auto px-[9.5%] pt-[4cqw] pb-[26cqw]">
          {/* Hoa văn xoắn chấm khắc cổ thanh mảnh kèm cặp chấm đôi hai bên phía trên "GỬI NGƯỜI VIẾNG THĂM" */}
          <div className="mx-auto mb-[7.2cqw] flex items-center justify-center gap-[4.6cqw] select-none">
            <span
              aria-hidden="true"
              className="text-[1.8cqw] leading-none tracking-[0.4em] text-[#9898a2]/70"
            >
              ••
            </span>
            <img
              src="/assets/aistudio/gothic_visitor_ornament.png?v=1"
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="gothic-chalk-print h-auto w-[10.4cqw] object-contain opacity-85"
            />
            <span
              aria-hidden="true"
              className="text-[1.8cqw] leading-none tracking-[0.4em] text-[#9898a2]/70"
            >
              ••
            </span>
          </div>

          {/* Tiêu đề "GỬI NGƯỜI VIẾNG THĂM" đồng bộ cỡ chữ thanh mảnh (2.85cqw) & giãn chữ rộng (0.24em) */}
          <div className="mb-[5.2cqw] flex flex-col items-center justify-center text-center">
            <h3 className="font-serif-title gothic-text-chalk flex items-center justify-center gap-[2.8cqw] text-[2.85cqw] leading-none font-normal tracking-[0.24em] whitespace-nowrap text-[#c0c0ca] uppercase">
              <span aria-hidden="true" className="text-[0.62em] text-[#9a9aa4]">
                ✦
              </span>
              <span>GỬI NGƯỜI VIẾNG THĂM</span>
              <span aria-hidden="true" className="text-[0.62em] text-[#9a9aa4]">
                ✦
              </span>
            </h3>
            <img
              src="/assets/aistudio/gothic_nav_divider.png?v=5"
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="mt-[2.4cqw] h-auto w-[28cqw] object-contain opacity-78 select-none"
            />
          </div>

          {/* Lời dặn trước khi đọc văn bia — phóng to rõ nét hơn mà vẫn giữ khoảng thở thoáng */}
          <div
            className="font-literary gothic-text-chalk mx-auto mb-[8.8cqw] max-w-[90%] text-justify text-[3.15cqw] leading-[1.72] font-normal tracking-[0.01em] text-[#c2c2cc]"
            style={{ textAlign: 'justify', textAlignLast: 'left' }}
          >
            <p className="text-justify">
              trước khi bắt đầu đọc văn bia, tình hãy đặt một nhành bông bạch
              cúc trước mộ phần của người đã khuất. mỗi văn bia đều có lá thư
              gửi &quot;thân yêu&quot;, tình nhấn vào đó sẽ kết nối với linh hồn
              tình muốn gặp gỡ.
            </p>
          </div>

          {/* Hoa văn kiếm ngang dây xích Gothic thanh mảnh đặt phía trên chữ Biên niên sử */}
          <div className="mb-[6.5cqw] flex flex-col items-center text-center">
            <div className="mb-[5.2cqw] flex items-center justify-center">
              <img
                src="/assets/aistudio/gothic_chronicle_sigil_divider.png?v=1"
                alt=""
                aria-hidden="true"
                referrerPolicy="no-referrer"
                className="gothic-chalk-print h-auto w-[48cqw] object-contain opacity-90 select-none"
              />
            </div>

            <div className="flex items-center justify-center gap-[4.2cqw]">
              <GothicTwinStarIcon className="h-[4cqw] w-[4.5cqw] opacity-80 drop-shadow-[0_0_4px_rgba(210,210,222,0.3)]" />
              <h2 className="font-gothique gothic-time-chalk text-[14.4cqw] leading-[1.06] font-normal tracking-[0.03em] whitespace-nowrap">
                Chronicles
              </h2>
              <GothicTwinStarIcon className="h-[4cqw] w-[4.5cqw] -scale-x-100 opacity-80 drop-shadow-[0_0_4px_rgba(210,210,222,0.3)]" />
            </div>
            <p className="font-serif-title gothic-text-chalk mt-[2cqw] text-[2.45cqw] leading-[1.35] tracking-[0.2em] text-[#b0b0ba] uppercase">
              {searchQuery.trim()
                ? `${activeRealmTitle} · Tìm thấy ${realmCharacters.length} linh hồn khớp với “${searchQuery.trim()}”`
                : `${activeRealmTitle} · ${realmCharacters.length} linh hồn an nghỉ`}
            </p>

            {/* Thanh tìm kiếm & Khung Yên Giấc Ngàn Thu chuẩn viền kép Gothic — đồng bộ 1:1 Mobile & Web/Device */}
            <div className="mt-[6.8cqw] flex w-full flex-col items-stretch justify-between gap-[2.5cqw]">
              <div className="relative flex-1 border border-[#c8c8ce]/40 bg-[#050507]/90 transition-colors focus-within:border-[#e4e4ec]/80">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[0.7cqw] border border-[#a1a1aa]/20"
                />
                <Search className="pointer-events-none absolute top-1/2 left-[3.2cqw] z-10 h-[3.6cqw] w-[3.6cqw] -translate-y-1/2 text-[#9898a2]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Tìm kiếm văn bia trong ${activeRealmTitle}...`}
                  className="font-serif-title relative z-10 w-full bg-transparent py-[2.6cqw] pr-[8cqw] pl-[9cqw] text-[3.1cqw] tracking-[0.03em] text-[#dcdce4] placeholder:italic placeholder:text-[#84848e] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 right-[3cqw] z-20 -translate-y-1/2 cursor-pointer p-[0.8cqw] text-[3cqw] text-[#9898a2] hover:text-white"
                    title="Xóa tìm kiếm"
                    aria-label="Xóa tìm kiếm"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Khung trang trí nghĩa trang đồng bộ viền kép Gothic */}
              <div className="font-serif-title gothic-chalk-print relative inline-flex shrink-0 items-center justify-center gap-[1.8cqw] border border-[#c8c8ce]/40 bg-[#050507]/90 px-[4cqw] py-[2.6cqw] text-[2.85cqw] tracking-[0.12em] text-[#dcdce4] uppercase select-none">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[0.7cqw] border border-[#a1a1aa]/20"
                />
                <span className="text-[0.75em] text-[#9e9ea8]">
                  ✦
                </span>
                <span>Yên Giấc Ngàn Thu</span>
                <span className="text-[0.75em] text-[#9e9ea8]">
                  ✦
                </span>
              </div>
            </div>
          </div>

          {/* Danh sách Bia Mộ Nhân Vật đóng khung Gothic Reliquary — đồng bộ 1:1 Mobile & Web/Device */}
          <section className="space-y-[6cqw]">
            {realmCharacters.length === 0 ? (
              <div className="relative border border-[#c8c8ce]/35 bg-[#050507]/92 p-[7.5cqw] text-center">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[0.85cqw] border border-[#a1a1aa]/20"
                />
                <div className="relative z-10 mx-auto mb-[3cqw] flex h-[8cqw] w-[8cqw] items-center justify-center border border-[#c8c8ce]/35 text-[3.4cqw] text-[#b8b8c2]">
                  ✦
                </div>
                <h3 className="font-serif-title relative z-10 text-[4.4cqw] tracking-[0.08em] text-[#e6e6ec] uppercase">
                  Không tìm thấy văn bia phù hợp
                </h3>
                <p className="font-sans-clean relative z-10 mt-[2cqw] text-[2.9cqw] text-[#9a9a9a]">
                  Không có linh hồn nào khớp với từ khóa “{searchQuery}” trong{' '}
                  {activeRealmTitle}.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="font-serif-title relative z-10 mt-[4cqw] inline-flex cursor-pointer items-center gap-[1.5cqw] border border-[#c8c8ce]/45 bg-[#0c0c10] px-[4cqw] py-[1.8cqw] text-[2.9cqw] tracking-[0.08em] text-[#e5e5e5] uppercase hover:border-white hover:bg-[#15151c]"
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

                const hasOffered = Boolean(offeredMap[char.id]);
                const displayCount = Math.max(1, flowerCounts[char.id] || 1);
                const isLockedWarning = lockedNoticeCharId === char.id;

                return (
                  <article
                    key={char.id}
                    onClick={() => handleTryOpenCharacter(char)}
                    className="group relative cursor-pointer border border-[#c8c8ce]/35 bg-[#050507]/92 p-[4.2cqw] shadow-[0_12px_34px_rgba(0,0,0,0.85)] transition-all duration-300 hover:border-[#e4e4ec]/70 hover:bg-[#09090d]"
                  >
                    {/* Viền khắc kép Gothic bên trong mỗi thẻ văn bia */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-[0.85cqw] border border-[#a1a1aa]/20 transition-colors duration-300 group-hover:border-[#d4d4d8]/40"
                    />

                    <div className="font-serif-title relative z-10 flex flex-wrap items-center justify-between gap-[2cqw] border-b border-white/12 pb-[2.5cqw] text-[2.7cqw] tracking-[0.11em] text-[#a8a8b2] uppercase">
                      <div className="flex items-center gap-[2cqw]">
                        <span className="font-tabular text-[#e2e2ea]">
                          {formattedNo}
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-[0.65em] text-zinc-500"
                        >
                          ✦
                        </span>
                        <span className="text-[#d0d0d8]">
                          {char.role
                            ? char.role.charAt(0).toUpperCase() +
                              char.role.slice(1)
                            : ''}
                        </span>
                      </div>
                      <span>{activeRealmTitle}</span>
                    </div>

                    <div className="relative z-10 mt-[4cqw] grid grid-cols-1 gap-[4cqw]">
                      {/* Portrait */}
                      <div>
                        <div className="relative aspect-square w-full overflow-hidden border border-[#c8c8ce]/30 bg-[#0d0d10] p-[1cqw]">
                          <div className="h-full w-full overflow-hidden bg-[#101010]">
                            <AuthenticPhotoFrame
                              image={char.avatar}
                              alt={char.name}
                              spectralMotion={false}
                              preserveColor={true}
                              className="h-full w-full"
                            />
                          </div>
                        </div>

                        {char.gallery.length > 0 && (
                          <div className="mt-[2cqw] grid grid-cols-3 gap-[1.5cqw]">
                            {char.gallery.slice(0, 3).map((gImg, gIdx) => (
                              <div
                                key={gIdx}
                                className="aspect-square overflow-hidden border border-white/15 bg-[#101010]"
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
                      <div className="flex flex-col justify-between text-left">
                        <div>
                          <h3 className="gothic-chalk-print font-serif-title text-[5.2cqw] leading-tight font-normal tracking-[0.11em] text-[#e6e6ec] uppercase">
                            {char.name}
                          </h3>
                          <p className="font-serif-title mt-[1cqw] text-[3.4cqw] font-light italic text-[#d0d0d6]">
                            “{char.alias}”
                          </p>

                          <div className="font-sans-clean mt-[3cqw] flex flex-wrap items-center gap-x-[2.5cqw] gap-y-[1cqw] border-y border-white/12 py-[2cqw] text-[2.6cqw] text-[#cccccc]">
                            <span>{char.age}</span>
                            <span
                              aria-hidden="true"
                              className="text-[0.7em] text-zinc-500"
                            >
                              ✦
                            </span>
                            <span>{char.height}</span>
                          </div>

                          <blockquote
                            className="font-sans-clean mt-[3cqw] text-justify text-[2.9cqw] leading-[1.65] font-light italic text-[#dcdce2]"
                            style={{
                              textAlign: 'justify',
                              textAlignLast: 'left',
                            }}
                          >
                            {char.quote}
                          </blockquote>
                        </div>

                        <div className="mt-[4cqw] border-t border-white/12 pt-[3cqw]">
                          <div className="font-sans-clean flex items-center justify-between gap-[2cqw] text-[2.75cqw]">
                            <button
                              type="button"
                              onClick={(e) => handleOfferFlower(e, char.id)}
                              title={
                                hasOffered
                                  ? 'Bạn đã đặt nhành bạch cúc viếng thăm ngôi mộ này'
                                  : 'Đặt một nhành bạch cúc viếng thăm để mở khóa văn bia'
                              }
                              className={`group/flower relative inline-flex cursor-pointer items-center gap-[1.5cqw] py-[0.5cqw] text-left transition-all duration-300 select-none ${
                                hasOffered
                                  ? 'text-[#e8e8ee] hover:text-white'
                                  : isLockedWarning
                                  ? 'animate-pulse text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.65)]'
                                  : 'text-[#a6a6b0] hover:text-[#e8e8ee]'
                              }`}
                            >
                              <span
                                className={`inline-flex items-center justify-center transition-transform duration-500 ${
                                  justOfferedCharId === char.id
                                    ? 'scale-125 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.75)]'
                                    : hasOffered
                                    ? 'text-[#e2e2ea] group-hover/flower:scale-110 group-hover/flower:text-white'
                                    : isLockedWarning
                                    ? 'scale-115 text-white'
                                    : 'text-[#9e9ea8] group-hover/flower:scale-110 group-hover/flower:text-[#e4e4ec]'
                                }`}
                              >
                                <WhiteChrysanthemumIcon
                                  className="h-[3.6cqw] w-[3.6cqw]"
                                  filled={hasOffered}
                                />
                              </span>
                              <span className="tracking-[0.03em]">
                                {hasOffered ? (
                                  <>
                                    <span className="font-tabular font-medium text-[#f2f2f7]">
                                      {displayCount}
                                    </span>{' '}
                                    <span>Nhành Bạch Cúc</span>
                                  </>
                                ) : (
                                  <span>Đặt Nhành Bạch Cúc</span>
                                )}
                              </span>
                            </button>

                            <span
                              className={`shrink-0 font-normal tracking-[0.04em] uppercase underline-offset-4 transition-colors duration-300 ${
                                hasOffered
                                  ? 'text-[#e5e5e5] group-hover:underline'
                                  : 'text-[#73737d]'
                              }`}
                            >
                              Đọc Văn Bia →
                            </span>
                          </div>

                          {isLockedWarning && !hasOffered && (
                            <p className="font-serif-title mt-[2cqw] text-[2.85cqw] italic tracking-[0.04em] text-[#d8d8e2]">
                              ✦ Xin khách viếng thăm hãy đặt một nhành bạch cúc trước khi đọc văn bia ✦
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </section>

          {/* Ba khung liên kết ở đáy trang trong — Đồng bộ 100% style, tỷ lệ cqw & hiệu ứng gothic-chalk-print giữa Mobile & Web/Device */}
          <footer
            aria-label="Liên kết lối đi"
            className="mt-[10cqw] border-t border-white/12 pt-[8cqw]"
          >
            <div className="gothic-chalk-print flex flex-wrap items-center justify-center gap-[2.5cqw]">
              <a
                href="https://discord.gg/silvestre"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap border border-[#c8c8ce]/55 bg-[#050507]/85 px-[3.8cqw] py-[2.4cqw] transition-all duration-300 hover:border-[#ececef] hover:bg-[#111115]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[0.7cqw] border border-[#a1a1aa]/30 transition-colors duration-300 group-hover:border-[#d4d4d8]/60"
                />
                <span className="relative z-10 flex items-center justify-center gap-[1.4cqw] font-serif-title text-[2.45cqw] font-normal tracking-[0.11em] text-[#e4e4ea] uppercase group-hover:text-white">
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
                className="group relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap border border-[#c8c8ce]/55 bg-[#050507]/85 px-[3.8cqw] py-[2.4cqw] transition-all duration-300 hover:border-[#ececef] hover:bg-[#111115]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[0.7cqw] border border-[#a1a1aa]/30 transition-colors duration-300 group-hover:border-[#d4d4d8]/60"
                />
                <span className="relative z-10 flex items-center justify-center gap-[1.4cqw] font-serif-title text-[2.45cqw] font-normal tracking-[0.11em] text-[#e4e4ea] uppercase group-hover:text-white">
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
                className="group relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap border border-[#c8c8ce]/55 bg-[#050507]/85 px-[3.8cqw] py-[2.4cqw] transition-all duration-300 hover:border-[#ececef] hover:bg-[#111115]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[0.7cqw] border border-[#a1a1aa]/30 transition-colors duration-300 group-hover:border-[#d4d4d8]/60"
                />
                <span className="relative z-10 flex items-center justify-center gap-[1.4cqw] font-serif-title text-[2.45cqw] font-normal tracking-[0.11em] text-[#e4e4ea] uppercase group-hover:text-white">
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
      </div>

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
