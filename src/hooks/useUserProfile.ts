import { useReducer, useCallback } from "react";
import { BaseApiResponse } from "@/types";
import { API_ENDPOINTS } from "@/constants";
import { userReducer, initialUserState } from "@/reducers";
import { httpClient, ErrorHandler } from "@/lib";
import { VALIDATION_RULES, VALIDATION_MESSAGES } from "@/constants";

export function useUserProfile() {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const { isUpdating, error, updateSuccess } = state;

  const validateUserName = useCallback((name: string): string | null => {
    if (!name.trim()) {
      return VALIDATION_MESSAGES.USER_NAME.REQUIRED;
    }
    if (name.trim().length > VALIDATION_RULES.USER_NAME.MAX_LENGTH) {
      return VALIDATION_MESSAGES.USER_NAME.TOO_LONG;
    }
    return null;
  }, []);

  const updateProfile = useCallback(
    async (
      userId: string,
      userName: string,
      email: string,
      onOptimisticUpdate: (name: string) => void
    ): Promise<boolean> => {
      const trimmedUserName = userName.trim();
      const validationError = validateUserName(trimmedUserName);

      if (validationError) {
        dispatch({ type: "SET_ERROR", payload: validationError });
        return false;
      }

      dispatch({ type: "SET_UPDATING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_UPDATE_SUCCESS", payload: false });

      // Optimistic update
      const originalName = userName;
      onOptimisticUpdate(trimmedUserName);

      try {
        // Firebase updateProfile
        const { firebaseAuth } = await import("@/lib/auth");
        const { updateProfile } = await import("firebase/auth");

        if (firebaseAuth.currentUser) {
          await updateProfile(firebaseAuth.currentUser, {
            displayName: trimmedUserName,
          });
        } else {
          console.warn("No Firebase currentUser found during profile update");
        }

        // Next.js API route call (正しいパターン)
        const response = await httpClient.put<BaseApiResponse>(
          API_ENDPOINTS.USER.UPDATE,
          {
            userId,
            userName: trimmedUserName,
            email,
          }
        );

        if (response.success) {
          // Update NextAuth session with new displayName
          if (typeof window !== "undefined") {
            try {
              const { getSession } = await import("next-auth/react");
              // Force session refresh to pick up Firebase Auth changes
              await getSession();

              // Save to localStorage as backup
              localStorage.setItem("lastUpdatedUserName", trimmedUserName);
              localStorage.setItem(
                "userNameUpdateTimestamp",
                Date.now().toString()
              );
            } catch (error) {
              console.warn(
                "Session refresh failed, but profile update succeeded:",
                error
              );
            }
          }

          dispatch({ type: "SET_UPDATE_SUCCESS", payload: true });
          return true;
        } else {
          // API エラーの場合、ロールバック
          onOptimisticUpdate(originalName);
          const errorMessage = ErrorHandler.getUserFriendlyMessage(
            response.error
          );
          dispatch({ type: "SET_ERROR", payload: errorMessage });
          ErrorHandler.logError(response.error);
          return false;
        }
      } catch (err) {
        // ネットワークエラー等の場合、ロールバック
        onOptimisticUpdate(originalName);

        let errorMessage = "プロフィールの更新に失敗しました。";
        if (err instanceof Error) {
          if (err.message.includes("Firebase")) {
            errorMessage =
              "Firebase認証の更新に失敗しました。再試行してください。";
          } else if (err.message.includes("Network")) {
            errorMessage =
              "ネットワークエラーが発生しました。接続を確認して再試行してください。";
          } else {
            errorMessage = err.message;
          }
        }
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        return false;
      }
    },
    [validateUserName]
  );

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, []);

  return {
    isUpdating,
    error,
    updateSuccess,
    updateProfile,
    validateUserName,
    resetState,
  };
}
