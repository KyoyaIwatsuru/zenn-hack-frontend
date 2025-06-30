export interface AddFlashcardState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export type AddFlashcardAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SUCCESS"; payload: boolean }
  | { type: "RESET_STATE" };

export const initialAddFlashcardState: AddFlashcardState = {
  isLoading: false,
  error: null,
  isSuccess: false,
};

export function addFlashcardReducer(
  state: AddFlashcardState,
  action: AddFlashcardAction
): AddFlashcardState {
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
        isSuccess: false,
      };

    case "SET_SUCCESS":
      return {
        ...state,
        isSuccess: action.payload,
        error: null,
      };

    case "RESET_STATE":
      return initialAddFlashcardState;

    default:
      return state;
  }
}
