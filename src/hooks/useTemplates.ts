import { useReducer, useCallback } from "react";
import { Template } from "@/types";
import { API_ENDPOINTS } from "@/constants";
import { templateReducer, initialTemplateState } from "@/reducers";
import { httpClient, ErrorHandler } from "@/lib";

export function useTemplates() {
  const [state, dispatch] = useReducer(templateReducer, initialTemplateState);
  const { templates, isLoading, error } = state;

  const loadTemplates = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    const response = await httpClient.get<{ templates: Template[] }>(
      API_ENDPOINTS.TEMPLATE.GET_ALL
    );

    if (response.success) {
      dispatch({
        type: "SET_TEMPLATES",
        payload: response.data.templates || [],
      });
    } else {
      const errorMessage = ErrorHandler.getUserFriendlyMessage(response.error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      ErrorHandler.logError(response.error);
    }
  }, []);

  return {
    templates,
    isLoading,
    error,
    loadTemplates,
  };
}
