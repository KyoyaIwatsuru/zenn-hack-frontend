import React, { useState } from "react";
import Image from "next/image";
import { CircleAlert, LoaderCircle, CircleCheck, ZoomIn } from "lucide-react";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { MediaModal } from "./MediaModal";

interface MediaDisplayProps {
  mediaUrls?: string[];
  word: string;
  translation?: string;
  onClick?: () => void;
  isInteractive?: boolean;
  status?: "pending" | "success" | "error";
  error?: string;
  mode?: "generate" | "compare"; // モードを追加: generate(生成モード), compare(比較モード)
}

export function MediaDisplay({
  mediaUrls,
  word,
  translation,
  onClick,
  isInteractive = false,
  status,
  error,
  mode = "generate", // デフォルトは生成モード
}: MediaDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // モードに応じてクリック可能かどうかを判定
  const isClickable =
    isInteractive && (mode === "compare" || !status || status === "error");

  const imageClasses = isClickable
    ? "hover:opacity-80 cursor-pointer transition-opacity"
    : "";

  // ステータスに応じたオーバーレイメッセージ
  const getStatusMessage = () => {
    switch (status) {
      case "success":
        return "Media作成が完了しました。選択にいきましょう";
      case "pending":
        return "Media作成途中です。しばらくお待ちください";
      case "error":
        return error || "Media作成が失敗しました。もう一度作成してみましょう";
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  const content = (
    <div
      className={`relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-lg ${imageClasses} group`}
      onClick={isClickable ? onClick : undefined}
    >
      {mediaUrls?.[0] ? (
        mediaUrls[0].endsWith(".mp4") ? (
          <video
            src={mediaUrls[0]}
            title={`${word} - ${translation}`}
            className="h-full w-full rounded-lg object-cover"
            autoPlay
            loop
            muted
            playsInline
            onError={() => {
              console.error("Failed to load video:", mediaUrls[0]);
            }}
          />
        ) : (
          <Image
            src={mediaUrls[0]}
            alt={`${word} - ${translation}`}
            fill
            className="rounded-lg object-cover"
            onError={() => {
              console.error("Failed to load image:", mediaUrls[0]);
            }}
          />
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-300">
          <div className="text-xs text-gray-500">Media</div>
        </div>
      )}

      {/* ステータスに応じたオーバーレイメッセージ（生成モードのみ） */}
      {statusMessage && mode === "generate" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="bg-primary max-w-32 rounded px-2 py-1 text-center text-xs text-black">
            {statusMessage}
          </div>
        </div>
      )}

      {/* Status badges */}
      {status === "success" && (
        <div className="bg-red absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full">
          <CircleCheck className="h-4 w-4 text-white" />
        </div>
      )}

      {status === "pending" && (
        <div className="bg-blue absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full">
          <LoaderCircle className="h-4 w-4 animate-spin text-white" />
        </div>
      )}

      {status === "error" && (
        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500">
          <CircleAlert className="h-4 w-4 text-white" />
        </div>
      )}

      {/* ZoomIn badge for states other than success, pending, error */}
      {!status && mode === "generate" && mediaUrls?.[0] && (
        <div
          className="absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <ZoomIn className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );

  // モードとステータスに応じてSimpleTooltipを表示
  if (isInteractive) {
    if (mode === "compare") {
      // 比較モードの場合、常にツールチップを表示
      return (
        <SimpleTooltip
          content="Mediaを比較する"
          position="bottom"
          backgroundColor="bg-main"
        >
          {content}
        </SimpleTooltip>
      );
    } else if (mode === "generate" && !status) {
      // 生成モードでステータスがない場合のみツールチップを表示
      return (
        <>
          <SimpleTooltip
            content="Mediaを作成する"
            position="bottom"
            backgroundColor="bg-main"
          >
            {content}
          </SimpleTooltip>
          {isModalOpen && (
            <MediaModal
              mediaUrl={mediaUrls?.[0]}
              word={word}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </>
      );
    }
  }

  return content;
}
