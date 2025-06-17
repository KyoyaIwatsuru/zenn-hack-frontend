import React, { useState } from "react";
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
        className="bg-whole !h-[95vh] !max-h-[95vh] !w-[70vw] !max-w-[95vw] overflow-y-auto p-6"
        style={{
          maxWidth: "95vw",
          width: "95vw",
          maxHeight: "95vh",
          height: "95vh",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-custom mb-4 text-xl">
            画像選択（使用したいカードを選択してください）
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* 古い画像のフラッシュカード */}
          <div>
            <FlashcardDisplay
              flashcard={flashcard}
              selectedMeaning={selectedMeaning}
              onMeaningSelect={onMeaningSelect}
              borderColor="border-blue"
            />
          </div>

          {/* 新しい画像のフラッシュカード */}
          <div>
            <FlashcardDisplay
              flashcard={flashcard}
              selectedMeaning={selectedMeaning}
              onMeaningSelect={onMeaningSelect}
              borderColor="border-red"
              customMedia={{
                mediaUrls: [], // TODO: 新しく生成された画像のURLをここに設定
              }}
            />
          </div>

          {/* issue12に取り組んだ後には、下記はいらない */}
          <div className="border-t pt-8">
            <p className="text-custom mb-6 text-center">
              どちらの画像を使用しますか？
            </p>

            <div className="grid grid-cols-2 gap-8">
              <Button
                variant="outline"
                onClick={handleSelectBefore}
                disabled={isSubmitting}
                className="border-blue text-blue hover:bg-blue-50"
              >
                {isSubmitting ? "送信中..." : "Before画像を選択"}
              </Button>
              <Button
                variant="outline"
                onClick={handleSelectAfter}
                disabled={isSubmitting}
                className="border-red text-red hover:bg-red-50"
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
