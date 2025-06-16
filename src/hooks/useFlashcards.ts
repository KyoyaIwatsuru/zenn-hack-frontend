import { useState, useCallback } from "react";
import { Flashcard, Meaning } from "@/types/type";
import { API_ENDPOINTS } from "@/constants";

export function useFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFlashcards = useCallback(async (userId: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.FLASHCARD.GET(userId));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.flashcards) {
        setFlashcards(data.flashcards);
      } else {
        setFlashcards([]);
      }
    } catch (err) {
      setError("フラッシュカードの読み込みに失敗しました");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCheckFlag = useCallback(async (flashcardId: string, checkFlag: boolean) => {
    // Optimistic update
    setFlashcards((prev) =>
      prev.map((card) =>
        card.flashcardId === flashcardId
          ? { ...card, checkFlag }
          : card
      )
    );

    try {
      const response = await fetch(API_ENDPOINTS.FLASHCARD.UPDATE_CHECK_FLAG, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId,
          checkFlag,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      // Rollback on error
      setFlashcards((prev) =>
        prev.map((card) =>
          card.flashcardId === flashcardId
            ? { ...card, checkFlag: !checkFlag }
            : card
        )
      );
      console.error("チェックフラグ更新エラー:", err);
    }
  }, []);

  const updateMemo = useCallback(async (flashcardId: string, memo: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.FLASHCARD.UPDATE_MEMO, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId,
          memo,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      setFlashcards((prev) =>
        prev.map((card) =>
          card.flashcardId === flashcardId ? { ...card, memo } : card
        )
      );
    } catch (err) {
      console.error("メモ更新エラー:", err);
      throw err;
    }
  }, []);

  const addMeanings = useCallback((flashcardId: string, newMeanings: Meaning[]) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.flashcardId === flashcardId
          ? { ...card, meanings: [...card.meanings, ...newMeanings] }
          : card
      )
    );
  }, []);

  const updateMedia = useCallback((flashcardId: string, media: unknown) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.flashcardId === flashcardId
          ? { ...card, media: media as Flashcard["media"] }
          : card
      )
    );
  }, []);

  return {
    flashcards,
    isLoading,
    error,
    loadFlashcards,
    updateCheckFlag,
    updateMemo,
    addMeanings,
    updateMedia,
  };
}