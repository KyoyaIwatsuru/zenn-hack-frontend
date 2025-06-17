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
  const containerClasses = isInteractive
    ? "bg-secondary hover:bg-secondary/80 cursor-pointer rounded-lg p-8 text-center transition-colors"
    : "bg-secondary rounded-lg p-8 text-center";

  return (
    <div
      className={containerClasses}
      onClick={isInteractive ? onClick : undefined}
    >
      <div className="relative mx-auto mb-2 h-32 w-32 overflow-hidden rounded-lg">
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
    </div>
  );
}
