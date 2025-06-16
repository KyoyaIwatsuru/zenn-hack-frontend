import { useState } from "react";
import { VALIDATION_RULES, VALIDATION_MESSAGES } from "@/constants";

export function useUserProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isOptimisticUpdate, setIsOptimisticUpdate] = useState(false);

  const validateUserName = (name: string): string | null => {
    if (!name.trim()) {
      return VALIDATION_MESSAGES.USER_NAME.REQUIRED;
    }
    if (name.trim().length > VALIDATION_RULES.USER_NAME.MAX_LENGTH) {
      return VALIDATION_MESSAGES.USER_NAME.TOO_LONG;
    }
    return null;
  };

  const updateProfile = async (
    userId: string,
    userName: string,
    email: string,
    onOptimisticUpdate: (name: string) => void
  ) => {
    const trimmedUserName = userName.trim();
    const validationError = validateUserName(trimmedUserName);

    if (validationError) {
      setError(validationError);
      return false;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    // Optimistic update
    const originalName = userName;
    setIsOptimisticUpdate(true);
    onOptimisticUpdate(trimmedUserName);

    try {
      // Firebase updateProfile
      const { firebaseAuth } = await import("@/lib/auth");
      const { updateProfile } = await import("firebase/auth");

      if (firebaseAuth.currentUser) {
        await updateProfile(firebaseAuth.currentUser, {
          displayName: trimmedUserName,
        });
      }

      // FastAPI updateUser
      const { apiService } = await import("@/services/apiService");
      await apiService.updateUser({
        userId,
        userName: trimmedUserName,
        email,
      });

      setIsOptimisticUpdate(false);
      setSuccess(true);

      return true;
    } catch (err) {
      // Rollback on error
      setIsOptimisticUpdate(false);
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
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError("");
    setSuccess(false);
    setIsOptimisticUpdate(false);
  };

  return {
    isLoading,
    error,
    success,
    isOptimisticUpdate,
    updateProfile,
    validateUserName,
    resetState,
  };
}
