export interface UserState {
  isUpdating: boolean;
  error: string | null;
  updateSuccess: boolean;
}

export type UserAction =
  | { type: "SET_UPDATING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_UPDATE_SUCCESS"; payload: boolean }
  | { type: "RESET_STATE" };

export const initialUserState: UserState = {
  isUpdating: false,
  error: null,
  updateSuccess: false,
};

export function userReducer(state: UserState, action: UserAction): UserState {
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

    case "SET_UPDATE_SUCCESS":
      return {
        ...state,
        updateSuccess: action.payload,
        isUpdating: false,
        error: null,
      };

    case "RESET_STATE":
      return initialUserState;

    default:
      return state;
  }
}
