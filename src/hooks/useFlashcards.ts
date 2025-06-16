import { useReducer, useCallback } from "react";
import { Flashcard, Meaning } from "@/types";
import { API_ENDPOINTS } from "@/constants";
import { flashcardReducer, initialFlashcardState } from "@/reducers";
import { httpClient, ErrorHandler } from "@/lib";

export function useFlashcards() {
  const [state, dispatch] = useReducer(flashcardReducer, initialFlashcardState);
  const { flashcards, isLoading, error } = state;

  const loadFlashcards = useCallback(async (userId: string) => {
    if (!userId) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    const response = await httpClient.get<{ flashcards: Flashcard[] }>(
      API_ENDPOINTS.FLASHCARD.GET(userId)
    );

    if (response.success) {
      dispatch({
        type: "SET_FLASHCARDS",
        payload: response.data.flashcards || [],
      });
    } else {
      const errorMessage = ErrorHandler.getUserFriendlyMessage(response.error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      ErrorHandler.logError(response.error);
    }
  }, []);

  const updateCheckFlag = useCallback(
    async (flashcardId: string, checkFlag: boolean) => {
      // Optimistic update
      dispatch({
        type: "UPDATE_CHECK_FLAG",
        payload: { flashcardId, checkFlag },
      });

      const response = await httpClient.put<void>(
        API_ENDPOINTS.FLASHCARD.UPDATE_CHECK_FLAG,
        {
          flashcardId,
          checkFlag,
        }
      );

      if (!response.success) {
        // Rollback on error
        dispatch({
          type: "UPDATE_CHECK_FLAG",
          payload: { flashcardId, checkFlag: !checkFlag },
        });
        const errorMessage = ErrorHandler.getUserFriendlyMessage(
          response.error
        );
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        ErrorHandler.logError(response.error);
      }
    },
    []
  );

  const updateMemo = useCallback(async (flashcardId: string, memo: string) => {
    const response = await httpClient.put<void>(
      API_ENDPOINTS.FLASHCARD.UPDATE_MEMO,
      {
        flashcardId,
        memo,
      }
    );

    if (response.success) {
      dispatch({ type: "UPDATE_MEMO", payload: { flashcardId, memo } });
    } else {
      const errorMessage = ErrorHandler.getUserFriendlyMessage(response.error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      ErrorHandler.logError(response.error);
      throw new Error(errorMessage);
    }
  }, []);

  const addMeanings = useCallback(
    (flashcardId: string, newMeanings: Meaning[]) => {
      const flashcard = flashcards.find((f) => f.flashcardId === flashcardId);
      if (flashcard) {
        const updatedMeanings = [...flashcard.meanings, ...newMeanings];
        dispatch({
          type: "UPDATE_MEANINGS",
          payload: { flashcardId, meanings: updatedMeanings },
        });
      }
    },
    [flashcards]
  );

  const updateMedia = useCallback(
    (flashcardId: string, media: Flashcard["media"]) => {
      dispatch({ type: "UPDATE_MEDIA", payload: { flashcardId, media } });
    },
    []
  );

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
