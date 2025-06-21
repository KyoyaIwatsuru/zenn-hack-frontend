import React, { useMemo } from "react";
import { Flashcard, Meaning, MediaCreateData } from "@/types";
import { LoadingSpinner, ErrorMessage } from "@/components/shared";
import { GeneratedFlashcardItem } from "./GeneratedFlashcardItem";

interface GeneratedFlashcardListProps {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string;
  selectedMeanings: Record<string, string>;
  mediaCreateResults: Record<string, MediaCreateData>;
  onCheckFlagToggle: (flashcardId: string) => void;
  onMeaningSelect: (flashcardId: string, meaningId: string) => void;
  onMeaningAdded: (flashcardId: string, newMeanings: Meaning[]) => void;
  onMeaningDeleted: (flashcardId: string, deletedMeanings: Meaning[]) => void;
  onMediaClick: (flashcard: Flashcard) => void;
  onMemoEdit: (flashcard: Flashcard) => void;
  onRetry: () => void;
}

export function GeneratedFlashcardList({
  flashcards,
  isLoading,
  error,
  selectedMeanings,
  mediaCreateResults,
  onCheckFlagToggle,
  onMeaningSelect,
  onMeaningAdded,
  onMeaningDeleted,
  onMediaClick,
  onMemoEdit,
  onRetry,
}: GeneratedFlashcardListProps) {
  const getSelectedMeaning = (flashcard: Flashcard) => {
    const selectedMeaningId = selectedMeanings[flashcard.flashcardId];
    if (selectedMeaningId) {
      return (
        flashcard.meanings.find((m) => m.meaningId === selectedMeaningId) ||
        flashcard.meanings[0]
      );
    }
    return flashcard.meanings[0];
  };

  // メディア生成済みフラッシュカードのみフィルタリング
  const generatedFlashcards = useMemo(() => {
    // mediaCreateResultsに存在するflashcardIdのフラッシュカードのみ表示
    return flashcards.filter(
      (flashcard) => mediaCreateResults[flashcard.flashcardId] !== undefined
    );
  }, [flashcards, mediaCreateResults]);

  // ローディング状態の管理
  if (isLoading) {
    return <LoadingSpinner message="フラッシュカード読み込み中..." />;
  }

  // エラー状態の管理
  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  // 空状態の適切な表示
  if (generatedFlashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-2 text-gray-500">生成済みの画像はありません</div>
        <div className="text-sm text-gray-400">
          単語一覧から画像を生成してから、こちらで比較を行ってください
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {generatedFlashcards.map((flashcard) => (
        <GeneratedFlashcardItem
          key={flashcard.flashcardId}
          flashcard={flashcard}
          selectedMeaning={getSelectedMeaning(flashcard)}
          onCheckFlagToggle={onCheckFlagToggle}
          onMeaningSelect={onMeaningSelect}
          onMeaningAdded={onMeaningAdded}
          onMeaningDeleted={onMeaningDeleted}
          onMediaClick={onMediaClick}
          onMemoEdit={onMemoEdit}
        />
      ))}
    </div>
  );
}
