import { useReducer, useCallback } from "react";
import { addFlashcardReducer, initialAddFlashcardState } from "@/reducers";
import { httpClient, ErrorHandler, ErrorType } from "@/lib";
import {
  API_ENDPOINTS,
  WORD_API_CONFIG,
  FLASHCARD_CREATE_API_CONFIG,
  USER_FLASHCARD_API_CONFIG,
} from "@/constants";
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
      // 最初に検証を行う（ローディング前）
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

      // 検証が通った場合のみローディング状態を設定
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // 最小限の遅延でUI更新を確実にする
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        // Step 1: 単語が存在するかチェック
        const wordResponse = await httpClient.get<WordSearchResponse>(
          API_ENDPOINTS.WORD.GET(word.trim()),
          {
            timeout: WORD_API_CONFIG.TIMEOUT,
            retries: WORD_API_CONFIG.RETRIES,
          }
        );

        let flashcardId: string;

        if (wordResponse.success) {
          // 単語が存在する場合：既存のflashcardIdを使用
          flashcardId = wordResponse.data.flashcardId;
        } else {
          // エラータイプを確認して適切に処理
          if (wordResponse.error.type === ErrorType.NOT_FOUND_ERROR) {
            // 単語が見つからない場合（404）のみ：フラッシュカードを作成
            const createResponse =
              await httpClient.post<FlashcardCreateResponse>(
                API_ENDPOINTS.FLASHCARD.FLASHCARD_CREATE,
                { word: word.trim() },
                {
                  timeout: FLASHCARD_CREATE_API_CONFIG.TIMEOUT,
                  retries: FLASHCARD_CREATE_API_CONFIG.RETRIES,
                }
              );

            if (createResponse.success) {
              flashcardId = createResponse.data.flashcardId;
            } else {
              const errorMessage = ErrorHandler.getUserFriendlyMessage(
                createResponse.error
              );
              dispatch({ type: "SET_ERROR", payload: errorMessage });
              ErrorHandler.logError(createResponse.error);
              return;
            }
          } else {
            // その他のエラー（ネットワークエラー、認証エラーなど）：エラーを表示して終了
            const errorMessage = ErrorHandler.getUserFriendlyMessage(
              wordResponse.error
            );
            dispatch({ type: "SET_ERROR", payload: errorMessage });
            ErrorHandler.logError(wordResponse.error);
            return;
          }
        }

        // Step 2: ユーザーにフラッシュカードを追加
        const addResponse = await httpClient.put(
          API_ENDPOINTS.USER_FLASHCARD.ADD,
          { userId, flashcardId },
          {
            timeout: USER_FLASHCARD_API_CONFIG.TIMEOUT,
            retries: USER_FLASHCARD_API_CONFIG.RETRIES,
          }
        );

        if (addResponse.success) {
          dispatch({ type: "SET_SUCCESS", payload: true });
        } else {
          const errorMessage = ErrorHandler.getUserFriendlyMessage(
            addResponse.error
          );
          dispatch({ type: "SET_ERROR", payload: errorMessage });
          ErrorHandler.logError(addResponse.error);
        }
      } finally {
        // MediaCreateModalと同じパターン：必ずローディング状態をリセット
        dispatch({ type: "SET_LOADING", payload: false });
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
