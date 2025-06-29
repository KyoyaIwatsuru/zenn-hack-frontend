import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface MediaModalProps {
  mediaUrl?: string;
  word: string;
  onClose: () => void;
}

export function MediaModal({ mediaUrl, word, onClose }: MediaModalProps) {
  if (!mediaUrl) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="relative max-h-screen max-w-[1000px] p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Media content */}
        <div className="rounded-lg bg-white p-2">
          {mediaUrl.endsWith(".mp4") ? (
            <video
              src={mediaUrl}
              title={`${word}`}
              className="max-h-[80vh] max-w-full rounded-lg"
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          ) : (
            <Image
              src={mediaUrl}
              alt={`${word}`}
              width={800}
              height={600}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
