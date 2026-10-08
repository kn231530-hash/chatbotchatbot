import React from 'react';
import { X, Download, Share2 } from 'lucide-react';

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="w-full flex items-center justify-between text-white/80 max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm font-medium truncate pr-4">{title || 'Media Viewer'}</span>
        <div className="flex items-center gap-2">
          <a
            href={imageUrl}
            download="shared-photo.jpg"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Download image"
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            title="Close viewer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div
        className="flex-1 flex items-center justify-center max-w-5xl w-full p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title || 'Enlarged media'}
          referrerPolicy="no-referrer"
          className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
        />
      </div>

      {/* Footer */}
      <div className="text-xs text-white/50 pb-2">
        Click anywhere outside image to close
      </div>
    </div>
  );
};
