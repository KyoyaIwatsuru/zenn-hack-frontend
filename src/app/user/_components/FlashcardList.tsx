import React from "react";
import { Flashcard, Meaning } from "@/types";
import { MediaCreateResult } from "@/types/ui";
import { LoadingSpinner, ErrorMessage } from "@/components/shared";
import { FlashcardItem } from "./FlashcardItem";
import { AddFlashcardForm } from "./AddFlashcardForm";

interface FlashcardListProps {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string;
  selectedMeanings: Record<string, string>;
  mediaCreateResults: Record<string, MediaCreateResult>;
  userId: string;
  onCheckFlagToggle: (flashcardId: string) => void;
  onMeaningSelect: (flashcardId: string, meaningId: string) => void;
  onMeaningAdded: (flashcardId: string, newMeanings: Meaning[]) => void;
  onMeaningDeleted: (flashcardId: string, deletedMeanings: Meaning[]) => void;
  onMediaClick: (flashcard: Flashcard) => void;
  onMemoEdit: (flashcard: Flashcard) => void;
  onRetry: () => void;
}

export function FlashcardList({
  flashcards,
  isLoading,
  error,
  selectedMeanings,
  mediaCreateResults,
  userId,
  onCheckFlagToggle,
  onMeaningSelect,
  onMeaningAdded,
  onMeaningDeleted,
  onMediaClick,
  onMemoEdit,
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
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <AddFlashcardForm
        userId={userId}
        existingFlashcards={flashcards}
        onSuccess={onRetry}
      />
      {flashcards.map((flashcard) => (
        <FlashcardItem
          key={flashcard.flashcardId}
          flashcard={flashcard}
          selectedMeaning={getSelectedMeaning(flashcard)}
          mediaCreateResult={mediaCreateResults[flashcard.flashcardId]}
          onCheckFlagToggle={onCheckFlagToggle}
          onMeaningSelect={onMeaningSelect}
          onMeaningAdded={onMeaningAdded}
          onMeaningDeleted={onMeaningDeleted}
          onMediaClick={onMediaClick}
          onMemoEdit={onMemoEdit}
          mediaMode="generate"
        />
      ))}
    </div>
  );
}
