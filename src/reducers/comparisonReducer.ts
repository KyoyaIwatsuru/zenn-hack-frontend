export interface ComparisonState {
  isUpdating: boolean;
  error: string | null;
  updateResult: boolean | null;
}

export type ComparisonAction =
  | { type: "SET_UPDATING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_UPDATE_RESULT"; payload: boolean }
  | { type: "RESET_STATE" };

export const initialComparisonState: ComparisonState = {
  isUpdating: false,
  error: null,
  updateResult: null,
};

export function comparisonReducer(
  state: ComparisonState,
  action: ComparisonAction
): ComparisonState {
  switch (action.type) {
    case "SET_UPDATING":
      return {
        ...state,
        isUpdating: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isUpdating: false,
      };

    case "SET_UPDATE_RESULT":
      return {
        ...state,
        updateResult: action.payload,
        isUpdating: false,
        error: null,
      };

    case "RESET_STATE":
      return initialComparisonState;

    default:
      return state;
  }
}
