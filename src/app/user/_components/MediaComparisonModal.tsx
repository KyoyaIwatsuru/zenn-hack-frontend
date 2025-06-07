import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flashcard, Meaning } from "@/types/type";
import { FlashcardDisplay } from "./FlashcardDisplay";
import { mockFlashcardService } from "@/services/mockService";

interface MediaComparisonModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: Flashcard | null;
  selectedMeaning: Meaning | null;
  onMeaningSelect: (meaningId: string) => void;
  onComparisonSubmitted: () => void;
}

export function MediaComparisonModal({
  isOpen,
  onOpenChange,
  flashcard,
  selectedMeaning,
  onMeaningSelect,
  onComparisonSubmitted,
}: MediaComparisonModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!flashcard || !selectedMeaning) {
    return null;
  }

  // Before画像を選択
  const handleSelectBefore = async () => {
    setIsSubmitting(true);

    try {
      await mockFlashcardService.compareMedia({
        comparisonId: `comparison_${Date.now()}`,
        oldMediaId: "before_media_id", // 実際のBefore画像ID
        newMediaId: "after_media_id", // 実際のAfter画像ID
        selected: "before",
      });

      onComparisonSubmitted();
      onOpenChange(false);
    } catch (error) {
      console.error("比較結果送信エラー:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // After画像を選択
  const handleSelectAfter = async () => {
    setIsSubmitting(true);

    try {
      await mockFlashcardService.compareMedia({
        comparisonId: `comparison_${Date.now()}`,
        oldMediaId: "before_media_id", // 実際のBefore画像ID
        newMediaId: "after_media_id", // 実際のAfter画像ID
        selected: "after",
      });

      onComparisonSubmitted();
      onOpenChange(false);
    } catch (error) {
      console.error("比較結果送信エラー:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-[95vw] !w-[95vw] !max-h-[95vh] !h-[95vh] overflow-y-auto p-6"
        style={{
          maxWidth: "95vw",
          width: "95vw",
          maxHeight: "95vh",
          height: "95vh",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-custom text-xl mb-4">
            画像比較
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* フラッシュカード表示 */}
          <FlashcardDisplay
            flashcard={flashcard}
            selectedMeaning={selectedMeaning}
            onMeaningSelect={onMeaningSelect}
          />

          {/* 画像比較セクション */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold text-custom mb-6">画像比較</h3>

            <p className="text-center text-custom mb-6">
              どちらの画像を使用しますか？
            </p>

            <div className="grid grid-cols-2 gap-8">
              {/* Before 画像 */}
              <div className="space-y-4">
                <div className="bg-blue-100 text-center py-3 rounded-t-lg">
                  <span className="text-blue-800 font-medium">Before</span>
                </div>
                <div className="bg-white border-4 border-blue-200 rounded-b-lg p-8">
                  <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-gray-300 rounded-lg mx-auto flex items-center justify-center">
                        <div className="text-gray-500 text-xs">Before画像</div>
                      </div>
                      {/* 実際の画像の代わりにプレースホルダー */}
                      <div className="text-sm text-gray-600">
                        医師が患者に説明している様子
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* After 画像 */}
              <div className="space-y-4">
                <div className="bg-red-100 text-center py-3 rounded-t-lg">
                  <span className="text-red-800 font-medium">After</span>
                </div>
                <div className="bg-white border-4 border-red-200 rounded-b-lg p-8">
                  <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-gray-300 rounded-lg mx-auto flex items-center justify-center">
                        <div className="text-gray-500 text-xs">After画像</div>
                      </div>
                      {/* 実際の画像の代わりにプレースホルダー */}
                      <div className="text-sm text-gray-600">
                        教師が黒板で説明している様子
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 選択ボタン */}
            <div className="grid grid-cols-2 gap-8 mt-6">
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
