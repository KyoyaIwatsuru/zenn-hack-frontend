import { MediaCreateData } from "@/types";

export interface MediaState {
  isCreating: boolean;
  error: string | null;
  createdMedia: MediaCreateData | null;
}

export type MediaAction =
  | { type: "SET_CREATING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CREATED_MEDIA"; payload: MediaCreateData | null }
  | { type: "RESET_STATE" };

export const initialMediaState: MediaState = {
  isCreating: false,
  error: null,
  createdMedia: null,
};

export function mediaReducer(
  state: MediaState,
  action: MediaAction
): MediaState {
  switch (action.type) {
    case "SET_CREATING":
      return {
        ...state,
        isCreating: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isCreating: false,
      };

    case "SET_CREATED_MEDIA":
      return {
        ...state,
        createdMedia: action.payload,
        isCreating: false,
        error: null,
      };

    case "RESET_STATE":
      return initialMediaState;

    default:
      return state;
  }
}
