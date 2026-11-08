import React, { useState } from 'react';
import { ImageCropConfig } from '../data/cemeteryData';

interface AuthenticPhotoFrameProps {
  image: ImageCropConfig;
  alt: string;
  className?: string;
  spectralMotion?: boolean;
  preserveColor?: boolean;
  onClick?: () => void;
}

/**
 * Renders 100% authentic photographs provided by the user (either full image or a specific panel
 * from the uploaded multi-panel collages) without any AI replacement or synthesis.
 */
export const AuthenticPhotoFrame: React.FC<AuthenticPhotoFrameProps> = ({
  image,
  alt,
  className = '',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-[#101010] ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {image.isCroppedPanel && !imgError ? (
        <div
          role="img"
          aria-label={alt}
          style={{
            backgroundImage: `url("${image.src}")`,
            backgroundSize: image.bgSize || 'cover',
            backgroundPosition: image.bgPos || 'center',
            backgroundRepeat: 'no-repeat',
          }}
          className="h-full w-full"
        />
      ) : !imgError ? (
        <img
          src={image.src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="block h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 text-center text-zinc-400">
          <span className="font-serif-title text-sm tracking-wide text-zinc-300">
            {alt}
          </span>
          <span className="mt-1 text-xs text-zinc-500">
            Bản Lưu Trữ Ảnh Thật
          </span>
        </div>
      )}
    </div>
  );
};
