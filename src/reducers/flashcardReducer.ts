import { Flashcard, Meaning, Media } from "@/types";

export interface FlashcardState {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string | null;
  isLoadingMeanings: boolean;
  meaningsError: string | null;
  availableMeanings: Record<string, Meaning[]>; // wordId -> meanings
}

export type FlashcardAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FLASHCARDS"; payload: Flashcard[] }
  | {
      type: "UPDATE_CHECK_FLAG";
      payload: { flashcardId: string; checkFlag: boolean };
    }
  | { type: "UPDATE_MEMO"; payload: { flashcardId: string; memo: string } }
  | {
      type: "UPDATE_MEANINGS";
      payload: { flashcardId: string; meanings: Meaning[] };
    }
  | { type: "UPDATE_MEDIA"; payload: { flashcardId: string; media: Media } }
  | { type: "SET_MEANINGS_LOADING"; payload: boolean }
  | { type: "SET_MEANINGS_ERROR"; payload: string | null }
  | {
      type: "SET_AVAILABLE_MEANINGS";
      payload: { wordId: string; meanings: Meaning[] };
    };

export const initialFlashcardState: FlashcardState = {
  flashcards: [],
  isLoading: false,
  error: null,
  isLoadingMeanings: false,
  meaningsError: null,
  availableMeanings: {},
};

export function flashcardReducer(
  state: FlashcardState,
  action: FlashcardAction
): FlashcardState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_FLASHCARDS":
      return {
        ...state,
        flashcards: action.payload,
        isLoading: false,
        error: null,
      };

    case "UPDATE_CHECK_FLAG":
      return {
        ...state,
        flashcards: state.flashcards.map((f) =>
          f.flashcardId === action.payload.flashcardId
            ? { ...f, checkFlag: action.payload.checkFlag }
            : f
        ),
      };

    case "UPDATE_MEMO":
      return {
        ...state,
        flashcards: state.flashcards.map((f) =>
          f.flashcardId === action.payload.flashcardId
            ? { ...f, memo: action.payload.memo }
            : f
        ),
      };

    case "UPDATE_MEANINGS":
      return {
        ...state,
        flashcards: state.flashcards.map((f) =>
          f.flashcardId === action.payload.flashcardId
            ? { ...f, meanings: action.payload.meanings }
            : f
        ),
      };

    case "UPDATE_MEDIA":
      return {
        ...state,
        flashcards: state.flashcards.map((f) =>
          f.flashcardId === action.payload.flashcardId
            ? { ...f, media: action.payload.media }
            : f
        ),
      };

    case "SET_MEANINGS_LOADING":
      return { ...state, isLoadingMeanings: action.payload };

    case "SET_MEANINGS_ERROR":
      return {
        ...state,
        meaningsError: action.payload,
        isLoadingMeanings: false,
      };

    case "SET_AVAILABLE_MEANINGS":
      return {
        ...state,
        availableMeanings: {
          ...state.availableMeanings,
          [action.payload.wordId]: action.payload.meanings,
        },
        isLoadingMeanings: false,
        meaningsError: null,
      };

    default:
      return state;
  }
}
