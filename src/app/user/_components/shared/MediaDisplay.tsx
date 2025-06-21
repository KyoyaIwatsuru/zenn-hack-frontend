import React from "react";
import Image from "next/image";
import { CircleAlert, LoaderCircle, CircleCheck } from "lucide-react";

interface MediaDisplayProps {
  mediaUrls?: string[];
  word: string;
  translation?: string;
  onClick?: () => void;
  isInteractive?: boolean;
  status?: "pending" | "success" | "error";
  error?: string;
}

export function MediaDisplay({
  mediaUrls,
  word,
  translation,
  onClick,
  isInteractive = false,
  status,
  error,
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

      {/* Status badges */}
      {status === "success" && (
        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
          <CircleCheck className="h-4 w-4 text-white" />
        </div>
      )}

      {status === "pending" && (
        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
          <LoaderCircle className="h-4 w-4 animate-spin text-white" />
        </div>
      )}

      {status === "error" && (
        <div className="group absolute top-2 right-2">
          <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500">
            <CircleAlert className="h-4 w-4 text-white" />
          </div>
          {/* Error tooltip */}
          {error && (
            <div className="pointer-events-none absolute top-8 right-0 z-10 max-w-48 rounded bg-red-600 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
