import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import {
  CharacterProfile,
  RealmId,
  UPLOADED_ASSETS,
  ImageCropConfig,
} from '../data/cemeteryData';
import { AuthenticPhotoFrame } from './AuthenticPhotoFrame';

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCharacter: (newChar: CharacterProfile) => void;
  defaultRealm: RealmId;
  rightForestName: string;
}

export const AddCharacterModal: React.FC<AddCharacterModalProps> = ({
  isOpen,
  onClose,
  onAddCharacter,
  defaultRealm,
  rightForestName,
}) => {
  const [realm, setRealm] = useState<RealmId>(defaultRealm);
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [role, setRole] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [affiliations, setAffiliations] = useState('');
  const [quote, setQuote] = useState('');
  const [appearance, setAppearance] = useState('');
  const [personality, setPersonality] = useState('');
  const [story, setStory] = useState('');
  const [trinketsInput, setTrinketsInput] = useState('');
  const [uploadedAvatar, setUploadedAvatar] = useState<string>('');
  const [uploadedGallery, setUploadedGallery] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedAvatar(reader.result);
        setErrorMessage('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedGallery((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên nhân vật.');
      return;
    }

    const avatarConfig: ImageCropConfig = uploadedAvatar
      ? { src: uploadedAvatar, isCroppedPanel: false }
      : {
          src: UPLOADED_ASSETS.memoriesGrid,
          isCroppedPanel: true,
          bgSize: '212% 312%',
          bgPos: '96% 4%',
        };

    const galleryConfigs: ImageCropConfig[] =
      uploadedGallery.length > 0
        ? uploadedGallery.map((url) => ({ src: url, isCroppedPanel: false }))
        : [avatarConfig];

    const realmLabel =
      realm === 'rung-co-tich' ? 'Rừng Cổ Tích' : rightForestName;

    const newCharacter: CharacterProfile = {
      id: `char-${Date.now()}`,
      realm,
      name: name.trim(),
      alias: alias.trim() || 'Linh Hồn Trầm Mặc',
      role: role.trim() || `Cư Dân ${realmLabel}`,
      age: age.trim() || 'Chưa rõ',
      height: height.trim() || 'Chưa rõ',
      affiliations: affiliations.trim() || realmLabel,
      quote:
        quote.trim() ||
        '“Giữa màn sương lạnh và tiếng gió qua rừng đá, có những ký ức không bao giờ tàn phai.”',
      appearance:
        appearance.trim() ||
        'Dáng vẻ trầm lặng mang đậm sắc thái cổ điển giữa màn sương đêm.',
      personality:
        personality.trim() || 'Lạnh lùng, sâu sắc và giữ nhiều bí mật.',
      story:
        story.trim() ||
        `Một nhân vật gắn liền với những đêm tuyết rơi tại ${realmLabel}.`,
      relationships: [],
      trinkets: trinketsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      avatar: avatarConfig,
      gallery: galleryConfigs,
      isCustom: true,
    };

    onAddCharacter(newCharacter);
    onClose();
  };

  const previewAvatar: ImageCropConfig = uploadedAvatar
    ? { src: uploadedAvatar, isCroppedPanel: false }
    : {
        src: UPLOADED_ASSETS.memoriesGrid,
        isCroppedPanel: true,
        bgSize: '212% 312%',
        bgPos: '96% 4%',
      };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-create-char"
    >
      <div className="bg-stone-ombre relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-zinc-700/80 p-6 shadow-2xl md:p-8">

        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="text-xs tracking-widest text-zinc-400 uppercase">
              Khởi Tạo Hồ Sơ
            </p>
            <h2
              id="modal-create-char"
              className="font-gothic text-ombre-gothic mt-1 text-2xl font-semibold md:text-3xl"
            >
              Thêm Nhân Vật Mới
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-zinc-700 bg-zinc-900/90 text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          {/* Left Column: Avatar & Gallery Upload */}
          <div className="space-y-4 lg:col-span-5">
            <div className="border border-zinc-700/80 bg-zinc-950/90 p-3">
              <div className="aspect-[4/5] w-full overflow-hidden border border-zinc-800">
                <AuthenticPhotoFrame
                  image={previewAvatar}
                  alt={name || 'Ảnh đại diện nhân vật'}
                  preserveColor={true}
                  className="h-full w-full"
                />
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="mt-3 flex w-full items-center justify-center gap-2 border border-zinc-600 bg-zinc-900 py-2.5 text-xs font-medium text-zinc-100 transition-colors hover:border-zinc-300 hover:bg-zinc-800"
              >
                <Upload className="h-4 w-4" />
                <span>Chọn Ảnh Đại Diện Nhân Vật</span>
              </button>
            </div>

            <div className="border border-zinc-800 bg-zinc-950/70 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-300">
                  Bộ Ảnh Moodboard ({uploadedGallery.length} ảnh)
                </span>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryFilesChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-200 hover:border-zinc-400"
                >
                  + Thêm Ảnh
                </button>
              </div>
              {uploadedGallery.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {uploadedGallery.map((url, idx) => (
                    <div
                      key={idx}
                      className="aspect-square overflow-hidden border border-zinc-700"
                    >
                      <img
                        src={url}
                        alt={`Moodboard ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Character Profile Fields */}
          <div className="space-y-4 lg:col-span-7">
            {errorMessage && (
              <div className="border border-red-800 bg-red-950/50 px-4 py-2 text-xs text-red-200">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs text-zinc-300">
                Thuộc Danh Sách Khu Rừng
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRealm('rung-co-tich')}
                  className={`border py-2 text-xs font-medium transition-all ${
                    realm === 'rung-co-tich'
                      ? 'border-zinc-300 bg-zinc-200 text-zinc-950'
                      : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  Rừng Cổ Tích (Bên Trái)
                </button>
                <button
                  type="button"
                  onClick={() => setRealm('rung-ben-phai')}
                  className={`border py-2 text-xs font-medium transition-all ${
                    realm === 'rung-ben-phai'
                      ? 'border-zinc-300 bg-zinc-200 text-zinc-950'
                      : 'border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  {rightForestName} (Bên Phải)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-zinc-300">
                  Tên Nhân Vật *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Kieran Vũ"
                  className="mt-1 w-full border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300">
                  Biệt Danh / Danh Xưng
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Ví dụ: Kẻ Canh Giữ Giờ Thứ Mười Hai"
                  className="mt-1 w-full border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs text-zinc-300">
                  Vai Trò / Chức Vị
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Chủ Nhân Tháp Cổ"
                  className="mt-1 w-full border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300">
                  Tuổi / Niên Đại
                </label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="22 tuổi"
                  className="mt-1 w-full border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300">Chiều Cao</label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="1m82"
                  className="mt-1 w-full border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-300">
                Câu Nói Đặc Trưng (Quote)
              </label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="“...”"
                className="mt-1 w-full border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-sm italic text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-zinc-300">
                  Ngoại Hình & Khí Chất
                </label>
                <textarea
                  rows={2}
                  value={appearance}
                  onChange={(e) => setAppearance(e.target.value)}
                  placeholder="Miêu tả diện mạo, trang phục..."
                  className="mt-1 w-full border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300">Tính Cách</label>
                <textarea
                  rows={2}
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  placeholder="Miêu tả tính cách, thói quen..."
                  className="mt-1 w-full border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-zinc-300">
                Tiểu Sử & Câu Chuyện
              </label>
              <textarea
                rows={3}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Quá khứ, biến cố và câu chuyện của nhân vật..."
                className="mt-1 w-full border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-300">
                Kỷ Vật / Di Vật (Phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={trinketsInput}
                onChange={(e) => setTrinketsInput(e.target.value)}
                placeholder="Đồng hồ bạc, Đàn guitar đen, Nhẫn cổ..."
                className="mt-1 w-full border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="border border-zinc-700 px-4 py-2 text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="border border-zinc-300 bg-zinc-100 px-5 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-white"
              >
                Lưu Hồ Sơ Nhân Vật
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
