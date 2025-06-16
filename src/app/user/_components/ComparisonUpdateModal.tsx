import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flashcard, Meaning } from "@/types";
import { DEFAULT_VALUES, API_ENDPOINTS } from "@/constants";
import { httpClient, ErrorHandler } from "@/lib";
import { FlashcardDisplay } from "./FlashcardDisplay";

interface ComparisonUpdateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: Flashcard | null;
  selectedMeaning: Meaning | null;
  onMeaningSelect: (meaningId: string) => void;
  onComparisonSubmitted: () => void;
}

export function ComparisonUpdateModal({
  isOpen,
  onOpenChange,
  flashcard,
  selectedMeaning,
  onMeaningSelect,
  onComparisonSubmitted,
}: ComparisonUpdateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!flashcard || !selectedMeaning) {
    return null;
  }

  const handleSelectBefore = async () => {
    setIsSubmitting(true);

    const response = await httpClient.post<void>(
      API_ENDPOINTS.COMPARISON.UPDATE,
      {
        flashcardId: flashcard.flashcardId,
        comparisonId: `${DEFAULT_VALUES.COMPARISON_ID_PREFIX}${Date.now()}`,
        oldMediaId: flashcard.media?.mediaId || "",
        newMediaId: `${DEFAULT_VALUES.MEDIA_ID_PREFIX}${Date.now()}`,
        isSelectedNew: false,
      }
    );

    if (response.success) {
      onComparisonSubmitted();
      onOpenChange(false);
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      console.error(
        "比較結果送信エラー:",
        ErrorHandler.getUserFriendlyMessage(response.error)
      );
    }

    setIsSubmitting(false);
  };

  const handleSelectAfter = async () => {
    setIsSubmitting(true);

    const response = await httpClient.post<void>(
      API_ENDPOINTS.COMPARISON.UPDATE,
      {
        flashcardId: flashcard.flashcardId,
        comparisonId: `${DEFAULT_VALUES.COMPARISON_ID_PREFIX}${Date.now()}`,
        oldMediaId: flashcard.media?.mediaId || "",
        newMediaId: `${DEFAULT_VALUES.MEDIA_ID_PREFIX}${Date.now()}`,
        isSelectedNew: true,
      }
    );

    if (response.success) {
      onComparisonSubmitted();
      onOpenChange(false);
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      console.error(
        "比較結果送信エラー:",
        ErrorHandler.getUserFriendlyMessage(response.error)
      );
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="!h-[95vh] !max-h-[95vh] !w-[95vw] !max-w-[95vw] overflow-y-auto p-6"
        style={{
          maxWidth: "95vw",
          width: "95vw",
          maxHeight: "95vh",
          height: "95vh",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-custom mb-4 text-xl">
            画像比較
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          <FlashcardDisplay
            flashcard={flashcard}
            selectedMeaning={selectedMeaning}
            onMeaningSelect={onMeaningSelect}
          />

          <div className="border-t pt-8">
            <h3 className="text-custom mb-6 text-xl font-semibold">画像比較</h3>

            <p className="text-custom mb-6 text-center">
              どちらの画像を使用しますか？
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="rounded-t-lg bg-blue-100 py-3 text-center">
                  <span className="font-medium text-blue-800">Before</span>
                </div>
                <div className="rounded-b-lg border-4 border-blue-200 bg-white p-8">
                  <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100">
                    <div className="space-y-4 text-center">
                      <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-lg">
                        {flashcard.media?.mediaUrls?.[0] ? (
                          <Image
                            src={flashcard.media.mediaUrls[0]}
                            alt={`Before - ${flashcard.word.word}`}
                            fill
                            className="rounded-lg object-cover"
                            onError={() => {
                              console.error(
                                "Failed to load image:",
                                flashcard.media.mediaUrls[0]
                              );
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-300">
                            <div className="text-xs text-gray-500">
                              Before画像
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedMeaning?.translation || "現在の画像"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-t-lg bg-red-100 py-3 text-center">
                  <span className="font-medium text-red-800">After</span>
                </div>
                <div className="rounded-b-lg border-4 border-red-200 bg-white p-8">
                  <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100">
                    <div className="space-y-4 text-center">
                      <div className="mx-auto h-24 w-24 overflow-hidden rounded-lg">
                        {/* TODO: 新しく生成された画像のURLをここに表示 */}
                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-300">
                          <div className="text-xs text-gray-500">After画像</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        新しく生成された画像
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-8">
              <Button
                variant="outline"
                onClick={handleSelectBefore}
                disabled={isSubmitting}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                {isSubmitting ? "送信中..." : "Before画像を選択"}
              </Button>
              <Button
                variant="outline"
                onClick={handleSelectAfter}
                disabled={isSubmitting}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                {isSubmitting ? "送信中..." : "After画像を選択"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
