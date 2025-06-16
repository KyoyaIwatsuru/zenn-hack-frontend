import React from "react";
import { Button } from "@/components/ui/button";
import { Flashcard, Meaning } from "@/types";
import { FlashcardItem } from "./FlashcardItem";

interface FlashcardListProps {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string;
  selectedMeanings: Record<string, string>;
  onCheckFlagToggle: (flashcardId: string) => void;
  onMeaningSelect: (flashcardId: string, meaningId: string) => void;
  onMeaningAdded: (flashcardId: string, newMeanings: Meaning[]) => void;
  onMediaClick: (flashcard: Flashcard) => void;
  onMemoEdit: (flashcard: Flashcard) => void;
  onCompareClick: (flashcard: Flashcard) => void;
  onRetry: () => void;
}

export function FlashcardList({
  flashcards,
  isLoading,
  error,
  selectedMeanings,
  onCheckFlagToggle,
  onMeaningSelect,
  onMeaningAdded,
  onMediaClick,
  onMemoEdit,
  onCompareClick,
  onRetry,
}: FlashcardListProps) {
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

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-custom">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600">{error}</div>
        <Button
          variant="outline"
          onClick={onRetry}
          className="mt-4"
        >
          再読み込み
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flashcards.map((flashcard) => (
        <FlashcardItem
          key={flashcard.flashcardId}
          flashcard={flashcard}
          selectedMeaning={getSelectedMeaning(flashcard)}
          onCheckFlagToggle={onCheckFlagToggle}
          onMeaningSelect={onMeaningSelect}
          onMeaningAdded={onMeaningAdded}
          onMediaClick={onMediaClick}
          onMemoEdit={onMemoEdit}
          onCompareClick={onCompareClick}
        />
      ))}
    </div>
  );
}