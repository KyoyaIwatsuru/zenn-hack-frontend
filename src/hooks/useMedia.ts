import { useReducer, useCallback } from "react";
import { MediaCreateRequest, MediaCreateData } from "@/types";
import { API_ENDPOINTS } from "@/constants";
import { mediaReducer, initialMediaState } from "@/reducers";
import { httpClient, ErrorHandler } from "@/lib";

export function useMedia() {
  const [state, dispatch] = useReducer(mediaReducer, initialMediaState);
  const { isCreating, error, createdMedia } = state;

  const createMedia = useCallback(async (request: MediaCreateRequest) => {
    dispatch({ type: "SET_CREATING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    // AI画像生成は時間がかかるため、長いタイムアウトを設定
    const response = await httpClient.post<MediaCreateData>(
      API_ENDPOINTS.MEDIA.CREATE,
      request,
      {
        timeout: 60000, // 60秒
        retries: 1, // リトライ回数を減らす
      }
    );

    if (response.success) {
      dispatch({ type: "SET_CREATED_MEDIA", payload: response.data });
    } else {
      const errorMessage = ErrorHandler.getUserFriendlyMessage(response.error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      ErrorHandler.logError(response.error);
    }

    dispatch({ type: "SET_CREATING", payload: false });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  return {
    isCreating,
    error,
    createdMedia,
    createMedia,
    resetState,
  };
}
