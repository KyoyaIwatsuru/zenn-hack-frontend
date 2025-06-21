import { useReducer, useCallback } from "react";
import { ComparisonUpdateRequest } from "@/types";
import { API_ENDPOINTS } from "@/constants";
import { comparisonReducer, initialComparisonState } from "@/reducers";
import { httpClient, ErrorHandler } from "@/lib";

export function useComparison() {
  const [state, dispatch] = useReducer(
    comparisonReducer,
    initialComparisonState
  );
  const { isUpdating, error, updateResult } = state;

  const updateComparison = useCallback(
    async (request: ComparisonUpdateRequest) => {
      dispatch({ type: "SET_UPDATING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const response = await httpClient.post(
        API_ENDPOINTS.COMPARISON.UPDATE,
        request
      );

      if (response.success) {
        dispatch({ type: "SET_UPDATE_RESULT", payload: true });
      } else {
        const errorMessage = ErrorHandler.getUserFriendlyMessage(
          response.error
        );
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        ErrorHandler.logError(response.error);
      }

      dispatch({ type: "SET_UPDATING", payload: false });
    },
    []
  );

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  return {
    isUpdating,
    error,
    updateResult,
    updateComparison,
    resetState,
  };
}
