import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Disc3, ChevronDown, ChevronUp } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const BackgroundMusicWidget: React.FC = () => {
  const {
    isPlaying,
    isMuted,
    volume,
    trackTitle,
    trackArtist,
    togglePlay,
    toggleMute,
    setVolume,
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <aside
      aria-label="Nhạc nền nghĩa trang"
      className="fixed bottom-4 left-4 z-40 select-none font-sans-clean transition-all duration-300 sm:bottom-6 sm:left-6"
    >
      {/* Mini Collapsed Pill / Disc */}
      {!isExpanded ? (
        <div className="group relative flex items-center gap-2 rounded-full border border-white/20 bg-[#070709]/90 px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.85)] backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-[#0d0d12]">
          {/* Subtle inner double hairline */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[2px] rounded-full border border-white/10 group-hover:border-white/20"
          />

          {/* Mini Vinyl Spinner or Note Icon */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền'}
            className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#18181b] text-[#e4e4e7] transition-transform duration-300 hover:scale-105"
          >
            <div
              className={`flex h-full w-full items-center justify-center rounded-full border border-[#3f3f46] ${
                isPlaying ? 'animate-spin [animation-duration:6s]' : ''
              }`}
            >
              {isPlaying ? (
                <Disc3 className="h-4 w-4 text-[#e4e4e7]" />
              ) : (
                <Play className="ml-0.5 h-3.5 w-3.5 fill-current text-[#d4d4d8]" />
              )}
            </div>
          </button>

          {/* Track Name & Artist */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="relative z-10 flex flex-col items-start text-left cursor-pointer pr-1"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-serif-title text-[11px] font-medium tracking-[0.08em] text-[#f4f4f5] sm:text-[12.5px]">
                {trackTitle}
              </span>
              {isPlaying && (
                <span className="flex items-end gap-[1.5px] h-2.5">
                  <span className="w-[1.5px] bg-[#d4d4d8] animate-[pulse_1s_ease-in-out_infinite] h-2" />
                  <span className="w-[1.5px] bg-[#a1a1aa] animate-[pulse_0.7s_ease-in-out_infinite] h-3" />
                  <span className="w-[1.5px] bg-[#e4e4e7] animate-[pulse_1.2s_ease-in-out_infinite] h-1.5" />
                </span>
              )}
            </div>
            <span className="text-[9px] font-light tracking-wider text-[#a1a1aa] sm:text-[10px]">
              {trackArtist} · {isPlaying ? 'Đang phát' : 'Đã tạm dừng'}
            </span>
          </button>

          {/* Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-label="Mở rộng trình phát nhạc"
            className="relative z-10 ml-0.5 text-[#a1a1aa] transition-colors hover:text-white"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        /* Expanded Gothic Music Card */
        <div className="relative w-[270px] rounded-lg border border-white/20 bg-[#070709]/95 p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.95)] backdrop-blur-md sm:w-[300px] sm:p-4">
          {/* Inner hairline border */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[3px] rounded-md border border-white/10"
          />

          {/* Header with Title & Collapse Button */}
          <div className="relative z-10 mb-3 flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <Music className="h-3.5 w-3.5 text-[#a1a1aa]" />
              <span className="font-serif-title text-[10px] font-medium tracking-[0.15em] text-[#d4d4d8] uppercase">
                Nhạc Nền Mặc Định
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              aria-label="Thu nhỏ trình phát nhạc"
              className="text-[#a1a1aa] transition-colors hover:text-white"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Track Detail Row */}
          <div className="relative z-10 mb-3 flex items-center gap-3">
            {/* Spinning Mini Vinyl */}
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#3f3f46] bg-[#141416] shadow-inner">
              <div
                className={`relative flex h-full w-full items-center justify-center ${
                  isPlaying ? 'animate-spin [animation-duration:6s]' : ''
                }`}
              >
                <div className="absolute inset-[15%] rounded-full border border-[#27272a]" />
                <div className="absolute inset-[30%] rounded-full border border-[#3f3f46]" />
                <div className="h-3 w-3 rounded-full bg-[#e4e4e7]" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="truncate font-serif-title text-[13px] font-normal tracking-wide text-[#f4f4f5]">
                {trackTitle}
              </h4>
              <p className="truncate text-[10.5px] font-light text-[#a1a1aa]">
                {trackArtist}
              </p>
            </div>
          </div>

          {/* Controls Bar: Play/Pause, Mute, Volume */}
          <div className="relative z-10 flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={togglePlay}
              className="flex items-center gap-1.5 rounded border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-[#e4e4e7] transition-all hover:border-white/30 hover:bg-white/10"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>Dừng</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Phát</span>
                </>
              )}
            </button>

            {/* Mute and Volume Slider */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Bật âm lượng' : 'Tắt tiếng'}
                className="text-[#a1a1aa] transition-colors hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 w-16 cursor-pointer accent-[#d4d4d8] sm:w-20"
                aria-label="Thanh âm lượng nhạc nền"
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
