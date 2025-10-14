import { useRef, useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  loading?: boolean;
}

export function ImageUpload({ onImageSelect, loading = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />

      {preview ? (
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-lg">
          <img
            src={preview}
            alt="Waste item preview"
            className="w-full h-full object-cover"
          />
          {!loading && (
            <button
              onClick={handleClear}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          )}
          {loading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm font-medium">Analyzing waste...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={loading}
          className="w-full aspect-square rounded-2xl border-3 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 transition-all flex flex-col items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors">
            <Camera className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700 mb-1">
              Scan Waste Item
            </p>
            <p className="text-sm text-slate-500">
              Take a photo or upload an image
            </p>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 font-medium">
            <Upload className="w-5 h-5" />
            <span>Choose Image</span>
          </div>
        </button>
      )}
    </div>
  );
}
