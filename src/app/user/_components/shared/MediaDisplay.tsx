import React from "react";
import Image from "next/image";

interface MediaDisplayProps {
  mediaUrls?: string[];
  word: string;
  translation?: string;
  onClick?: () => void;
  isInteractive?: boolean;
}

export function MediaDisplay({
  mediaUrls,
  word,
  translation,
  onClick,
  isInteractive = false,
}: MediaDisplayProps) {
  const imageClasses = isInteractive
    ? "hover:opacity-80 cursor-pointer transition-opacity"
    : "";

  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-lg ${imageClasses}`}
      onClick={isInteractive ? onClick : undefined}
    >
      {mediaUrls?.[0] ? (
        <Image
          src={mediaUrls[0]}
          alt={`${word} - ${translation}`}
          fill
          className="rounded-lg object-cover"
          onError={() => {
            console.error("Failed to load image:", mediaUrls[0]);
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-300">
          <div className="text-xs text-gray-500">画像</div>
        </div>
      )}
    </div>
  );
}
