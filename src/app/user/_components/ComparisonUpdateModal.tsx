import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Flashcard,
  Meaning,
  MediaCreateData,
  ComparisonUpdateRequest,
} from "@/types";
import { ErrorMessage } from "@/components/shared";
import { FlashcardDisplay } from "./FlashcardDisplay";

interface ComparisonUpdateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: Flashcard | null;
  selectedMeaning: Meaning | null;
  mediaCreateResults: Record<string, MediaCreateData>;
  onMeaningSelect: (meaningId: string) => void;
  onComparisonUpdate: (request: ComparisonUpdateRequest) => Promise<void>;
  onComparisonComplete: (flashcardId: string) => void;
}

export function ComparisonUpdateModal({
  isOpen,
  onOpenChange,
  flashcard,
  selectedMeaning,
  mediaCreateResults,
  onMeaningSelect,
  onComparisonUpdate,
  onComparisonComplete,
}: ComparisonUpdateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!flashcard || !selectedMeaning) {
    return null;
  }

  // 現在のフラッシュカードに対応するメディア生成結果を取得
  const currentMediaResult = mediaCreateResults[flashcard.flashcardId];

  if (!currentMediaResult) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-whole max-w-md">
          <DialogHeader>
            <DialogTitle className="text-custom">
              生成データが見つかりません
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="mb-4 text-gray-500">
              このフラッシュカードの生成データが見つかりません。
            </p>
            <Button onClick={() => onOpenChange(false)}>閉じる</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSelectCurrent = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const request: ComparisonUpdateRequest = {
        flashcardId: flashcard.flashcardId,
        comparisonId: currentMediaResult.comparisonId,
        oldMediaId: flashcard.media?.mediaId || "",
        newMediaId: currentMediaResult.newMediaId,
        isSelectedNew: false, // 現在の画像を選択
      };

      await onComparisonUpdate(request);
      onComparisonComplete(flashcard.flashcardId);
      onOpenChange(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "比較更新に失敗しました";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectNew = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const request: ComparisonUpdateRequest = {
        flashcardId: flashcard.flashcardId,
        comparisonId: currentMediaResult.comparisonId,
        oldMediaId: flashcard.media?.mediaId || "",
        newMediaId: currentMediaResult.newMediaId,
        isSelectedNew: true, // 新しい画像を選択
      };

      await onComparisonUpdate(request);
      onComparisonComplete(flashcard.flashcardId);
      onOpenChange(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "比較更新に失敗しました";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
          {/* 現在の画像のフラッシュカード */}
          <div>
            <h3 className="text-custom mb-3 text-lg font-semibold">
              現在の画像
            </h3>
            <FlashcardDisplay
              flashcard={flashcard}
              selectedMeaning={selectedMeaning}
              onMeaningSelect={onMeaningSelect}
              borderColor="border-blue"
            />
          </div>

          {/* 新しく生成された画像のフラッシュカード */}
          <div>
            <h3 className="text-custom mb-3 text-lg font-semibold">
              生成された新しい画像
            </h3>
            <FlashcardDisplay
              flashcard={flashcard}
              selectedMeaning={selectedMeaning}
              onMeaningSelect={onMeaningSelect}
              borderColor="border-red"
              customMedia={{
                mediaUrls: currentMediaResult.newMediaUrls,
              }}
            />
          </div>

          {/* エラー表示 */}
          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => setError(null)}
              retryText="エラーをクリア"
            />
          )}

          {/* 選択ボタン */}
          <div className="border-t pt-8">
            <p className="text-custom mb-6 text-center text-lg">
              どちらの画像を使用しますか？
            </p>

            <div className="grid grid-cols-2 gap-8">
              <Button
                variant="outline"
                onClick={handleSelectCurrent}
                disabled={isSubmitting}
                className="border-blue text-blue h-12 text-lg hover:bg-blue-50"
              >
                {isSubmitting ? "送信中..." : "現在の画像を選択"}
              </Button>
              <Button
                variant="outline"
                onClick={handleSelectNew}
                disabled={isSubmitting}
                className="border-red text-red h-12 text-lg hover:bg-red-50"
              >
                {isSubmitting ? "送信中..." : "新しい画像を選択"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
