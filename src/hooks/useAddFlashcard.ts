import { useReducer, useCallback } from "react";
import { addFlashcardReducer, initialAddFlashcardState } from "@/reducers";
import { httpClient } from "@/lib";
import { API_ENDPOINTS } from "@/constants";
import {
  Flashcard,
  WordSearchResponse,
  FlashcardCreateResponse,
} from "@/types";

export function useAddFlashcard() {
  const [state, dispatch] = useReducer(
    addFlashcardReducer,
    initialAddFlashcardState
  );
  const { isLoading, error, isSuccess } = state;

  const addFlashcard = useCallback(
    async (
      word: string,
      userId: string,
      existingFlashcards: Flashcard[] = []
    ) => {
      if (!word.trim() || !userId) {
        dispatch({
          type: "SET_ERROR",
          payload: "単語とユーザーIDが必要です。",
        });
        return;
      }

      // 既存のフラッシュカードに同じ単語がないかチェック
      const trimmedWord = word.trim().toLowerCase();
      const isDuplicate = existingFlashcards.some(
        (flashcard) => flashcard.word.word.toLowerCase() === trimmedWord
      );

      if (isDuplicate) {
        dispatch({
          type: "SET_ERROR",
          payload: "この単語は既にフラッシュカードに追加されています。",
        });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_SUCCESS", payload: false });

      try {
        // Step 1: 単語が存在するかチェック
        try {
          const wordResponse = await httpClient.get<WordSearchResponse>(
            API_ENDPOINTS.WORD.GET(word.trim())
          );

          if (wordResponse.success) {
            // 単語が存在する場合：直接フラッシュカードを追加
            const flashcardId = wordResponse.data.flashcardId;

            await httpClient.put(API_ENDPOINTS.USER_FLASHCARD.ADD, {
              userId,
              flashcardId,
            });

            dispatch({ type: "SET_SUCCESS", payload: true });
          } else {
            throw new Error("Word not found");
          }
        } catch {
          // 単語が存在しない場合：フラッシュカードを作成してから追加
          const createResponse = await httpClient.post<FlashcardCreateResponse>(
            API_ENDPOINTS.FLASHCARD.FLASHCARD_CREATE,
            { word: word.trim() }
          );

          if (createResponse.success) {
            // フラッシュカード作成成功後、ユーザーに追加
            const flashcardId = createResponse.data.flashcardId;

            await httpClient.put(API_ENDPOINTS.USER_FLASHCARD.ADD, {
              userId,
              flashcardId,
            });

            dispatch({ type: "SET_SUCCESS", payload: true });
          } else {
            throw new Error("Failed to create flashcard");
          }
        }
      } catch (error) {
        console.log("Error caught, setting loading to false");
        const errorMessage =
          error instanceof Error
            ? error.message
            : "予期しないエラーが発生しました。";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      }
    },
    []
  );

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  return {
    isLoading,
    error,
    isSuccess,
    addFlashcard,
    resetState,
  };
}
