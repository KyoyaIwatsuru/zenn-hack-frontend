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

    const response = await httpClient.post<MediaCreateData>(
      API_ENDPOINTS.MEDIA.CREATE,
      request
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
