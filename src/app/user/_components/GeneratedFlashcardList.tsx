import React from "react";
import { Flashcard, Meaning } from "@/types";
import { LoadingSpinner, ErrorMessage } from "@/components/shared";
import { GeneratedFlashcardItem } from "./GeneratedFlashcardItem";

interface GeneratedFlashcardListProps {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string;
  selectedMeanings: Record<string, string>;
  onCheckFlagToggle: (flashcardId: string) => void;
  onMeaningSelect: (flashcardId: string, meaningId: string) => void;
  onMeaningAdded: (flashcardId: string, newMeanings: Meaning[]) => void;
  onMediaClick: (flashcard: Flashcard) => void;
  onMemoEdit: (flashcard: Flashcard) => void;
  onRetry: () => void;
}

export function GeneratedFlashcardList({
  flashcards,
  isLoading,
  error,
  selectedMeanings,
  onCheckFlagToggle,
  onMeaningSelect,
  onMeaningAdded,
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

  // 画像が生成されている単語のみフィルタリング
  const generatedFlashcards = flashcards.filter(
    (flashcard) =>
      flashcard.media?.mediaUrls && flashcard.media.mediaUrls.length > 0
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (generatedFlashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-2 text-gray-500">
          画像が生成された単語はまだありません
        </div>
        <div className="text-sm text-gray-400">
          単語一覧から画像を生成してください
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
          onMediaClick={onMediaClick}
          onMemoEdit={onMemoEdit}
        />
      ))}
    </div>
  );
}
