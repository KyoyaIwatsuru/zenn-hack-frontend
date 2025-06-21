import { useReducer, useCallback } from "react";
import { Flashcard, Meaning } from "@/types";
import { API_ENDPOINTS } from "@/constants";
import { flashcardReducer, initialFlashcardState } from "@/reducers";
import { httpClient, ErrorHandler } from "@/lib";

export function useFlashcards() {
  const [state, dispatch] = useReducer(flashcardReducer, initialFlashcardState);
  const {
    flashcards,
    isLoading,
    error,
    isLoadingMeanings,
    meaningsError,
    availableMeanings,
  } = state;

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

  const getMeanings = useCallback(
    async (wordId: string): Promise<Meaning[]> => {
      // キャッシュされた意味があれば返す
      if (availableMeanings[wordId]) {
        return availableMeanings[wordId];
      }

      dispatch({ type: "SET_MEANINGS_LOADING", payload: true });
      dispatch({ type: "SET_MEANINGS_ERROR", payload: null });

      const response = await httpClient.get<{ meanings: Meaning[] }>(
        API_ENDPOINTS.MEANING.GET(wordId)
      );

      if (response.success) {
        const meanings = response.data.meanings || [];
        dispatch({
          type: "SET_AVAILABLE_MEANINGS",
          payload: { wordId, meanings },
        });
        return meanings;
      } else {
        const errorMessage = ErrorHandler.getUserFriendlyMessage(
          response.error
        );
        dispatch({ type: "SET_MEANINGS_ERROR", payload: errorMessage });
        ErrorHandler.logError(response.error);
        throw new Error(errorMessage);
      }
    },
    [availableMeanings]
  );

  const addMeanings = useCallback(
    async (flashcardId: string, newMeanings: Meaning[]) => {
      const flashcard = flashcards.find((f) => f.flashcardId === flashcardId);
      if (!flashcard) return;

      // 既存の意味IDリストを取得
      const existingMeaningIds = flashcard.meanings.map((m) => m.meaningId);
      // 新しく追加する意味IDリストを取得
      const newMeaningIds = newMeanings.map((meaning) => meaning.meaningId);
      // 既存 + 新規をマージして重複除去
      const allMeaningIds = [
        ...new Set([...existingMeaningIds, ...newMeaningIds]),
      ];

      const response = await httpClient.put<void>(
        API_ENDPOINTS.FLASHCARD.UPDATE_MEANINGS,
        {
          flashcardId,
          usingMeaningIdList: allMeaningIds,
        }
      );

      if (response.success) {
        const updatedMeanings = [...flashcard.meanings, ...newMeanings];
        dispatch({
          type: "UPDATE_MEANINGS",
          payload: { flashcardId, meanings: updatedMeanings },
        });
      } else {
        const errorMessage = ErrorHandler.getUserFriendlyMessage(
          response.error
        );
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        ErrorHandler.logError(response.error);
        throw new Error(errorMessage);
      }
    },
    [flashcards]
  );

  const deleteMeanings = useCallback(
    async (flashcardId: string, meaningsToDelete: Meaning[]) => {
      const flashcard = flashcards.find((f) => f.flashcardId === flashcardId);
      if (!flashcard) return;

      // 削除する意味IDのセットを作成
      const deleteIds = new Set(meaningsToDelete.map((m) => m.meaningId));
      // 残す意味IDリストを作成
      const remainingMeaningIds = flashcard.meanings
        .filter((meaning) => !deleteIds.has(meaning.meaningId))
        .map((meaning) => meaning.meaningId);

      const response = await httpClient.put<void>(
        API_ENDPOINTS.FLASHCARD.UPDATE_MEANINGS,
        {
          flashcardId,
          usingMeaningIdList: remainingMeaningIds,
        }
      );

      if (response.success) {
        const updatedMeanings = flashcard.meanings.filter(
          (meaning) => !deleteIds.has(meaning.meaningId)
        );
        dispatch({
          type: "UPDATE_MEANINGS",
          payload: { flashcardId, meanings: updatedMeanings },
        });
      } else {
        const errorMessage = ErrorHandler.getUserFriendlyMessage(
          response.error
        );
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        ErrorHandler.logError(response.error);
        throw new Error(errorMessage);
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
    isLoadingMeanings,
    meaningsError,
    availableMeanings,
    loadFlashcards,
    updateCheckFlag,
    updateMemo,
    getMeanings,
    addMeanings,
    deleteMeanings,
    updateMedia,
  };
}
