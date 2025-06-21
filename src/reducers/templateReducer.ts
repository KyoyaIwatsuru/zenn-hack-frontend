import { Template } from "@/types";

export interface TemplateState {
  templates: Template[];
  isLoading: boolean;
  error: string | null;
}

export type TemplateAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TEMPLATES"; payload: Template[] };

export const initialTemplateState: TemplateState = {
  templates: [],
  isLoading: false,
  error: null,
};

export function templateReducer(
  state: TemplateState,
  action: TemplateAction
): TemplateState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case "SET_TEMPLATES":
      return {
        ...state,
        templates: action.payload,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}
