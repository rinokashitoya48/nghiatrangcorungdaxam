import React from 'react';
import { X } from 'lucide-react';
import { ImageCropConfig } from '../data/cemeteryData';
import { AuthenticPhotoFrame } from './AuthenticPhotoFrame';
import { GothicCornerFiligree } from './GothicOrnaments';

export interface LightboxItem {
  title: string;
  subtitle: string;
  description: string;
  image: ImageCropConfig;
}

interface LightboxModalProps {
  item: LightboxItem | null;
  onClose: () => void;
  fontClass: string;
  spectralMotion: boolean;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  onClose,
  fontClass,
  spectralMotion,
}) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-stone-slab relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-zinc-700/80 p-6 shadow-2xl md:p-8"
      >
        <GothicCornerFiligree className="absolute top-2 left-2 h-10 w-10 text-zinc-500/70" />
        <GothicCornerFiligree className="absolute top-2 right-2 h-10 w-10 rotate-90 text-zinc-500/70" />
        <GothicCornerFiligree className="absolute bottom-2 left-2 h-10 w-10 -rotate-90 text-zinc-500/70" />
        <GothicCornerFiligree className="absolute right-2 bottom-2 h-10 w-10 rotate-180 text-zinc-500/70" />

        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="text-xs text-zinc-400">{item.subtitle}</p>
            <h2
              className={`${fontClass} mt-1 text-2xl font-semibold text-zinc-100 md:text-3xl`}
            >
              {item.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-zinc-700 bg-zinc-900 text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
            aria-label="Đóng trình xem ảnh"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 overflow-hidden border border-zinc-800 bg-black">
          {item.image.isCroppedPanel ? (
            <div className="aspect-square max-h-[65vh] w-full mx-auto">
              <AuthenticPhotoFrame
                image={item.image}
                alt={item.title}
                spectralMotion={spectralMotion}
                preserveColor={true}
                className="h-full w-full"
              />
            </div>
          ) : (
            <img
              src={item.image.src}
              alt={item.title}
              referrerPolicy="no-referrer"
              className={`mx-auto max-h-[68vh] w-auto object-contain ${
                spectralMotion ? 'animate-spectral' : ''
              }`}
            />
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-zinc-300">
          {item.description}
        </p>
      </div>
    </div>
  );
};
