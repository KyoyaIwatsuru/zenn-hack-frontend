import React, { useCallback } from "react";
import { Flashcard, Meaning } from "@/types";
import { FlashcardItem } from "./FlashcardItem";
import { VisibilitySettings } from "./VisibilityControlPanel";
import { LoadingSpinner } from "@/components/shared";
import { ErrorMessage } from "@/components/shared";

interface MemorizationFlashcardListProps {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string;
  selectedMeanings: Record<string, string>;
  globalVisibilitySettings: VisibilitySettings;
  isApplyingSettings: boolean;
  appliedCardsCount: number;
  onCheckFlagToggle: (flashcardId: string) => void;
  onMemoEdit: (flashcard: Flashcard) => void;
  onRetry: () => void;
  onSettingsApplied: () => void;
  onAppliedCardsCountChange: (count: number) => void;
}

export function MemorizationFlashcardList({
  flashcards,
  isLoading,
  error,
  selectedMeanings,
  globalVisibilitySettings,
  isApplyingSettings,
  appliedCardsCount,
  onCheckFlagToggle,
  onMemoEdit,
  onRetry,
  onSettingsApplied,
  onAppliedCardsCountChange,
}: MemorizationFlashcardListProps) {
  // 各カードからの更新完了通知
  const handleCardVisibilityUpdate = useCallback(() => {
    onAppliedCardsCountChange(appliedCardsCount + 1);
    // すべてのカードに適用が完了したら処理完了状態にする
    if (appliedCardsCount + 1 >= flashcards.length) {
      setTimeout(() => {
        onSettingsApplied();
      }, 300); // 少し遅延を入れて完了を演出
    }
  }, [
    appliedCardsCount,
    flashcards.length,
    onAppliedCardsCountChange,
    onSettingsApplied,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={`フラッシュカードの読み込みに失敗しました: ${error}`}
        onRetry={onRetry}
      />
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">フラッシュカードがありません</p>
      </div>
    );
  }

  const getSelectedMeaning = (flashcard: Flashcard): Meaning => {
    const selectedId = selectedMeanings[flashcard.flashcardId];
    return (
      flashcard.meanings.find((m) => m.meaningId === selectedId) ||
      flashcard.meanings[0]
    );
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl space-y-4">
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600">
            各要素をクリックして表示/非表示を切り替えながら暗記しましょう
          </p>
        </div>

        {flashcards.map((flashcard) => (
          <FlashcardItem
            key={flashcard.flashcardId}
            flashcard={flashcard}
            selectedMeaning={getSelectedMeaning(flashcard)}
            onCheckFlagToggle={onCheckFlagToggle}
            onMeaningSelect={() => {}} // 暗記モードでは無効
            onMeaningAdded={() => {}} // 暗記モードでは無効
            onMeaningDeleted={() => {}} // 暗記モードでは無効
            onMediaClick={() => {}} // 暗記モードでは無効
            onMemoEdit={onMemoEdit}
            // 暗記モード設定
            memorizationMode={true}
            globalVisibilitySettings={
              isApplyingSettings ? globalVisibilitySettings : undefined
            }
            onVisibilityUpdate={handleCardVisibilityUpdate}
          />
        ))}
      </div>
    </div>
  );
}
