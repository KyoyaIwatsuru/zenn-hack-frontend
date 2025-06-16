import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { VALIDATION_RULES, VALIDATION_MESSAGES } from "@/constants";

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateLoginForm = (form: LoginForm): string | null => {
    if (form.email.length === 0 || form.password.length === 0) {
      return VALIDATION_MESSAGES.GENERAL.ALL_FIELDS_REQUIRED;
    }
    return null;
  };

  const validateSignupForm = (form: SignupForm): string | null => {
    if (!form.email || !form.userName || !form.password) {
      return VALIDATION_MESSAGES.GENERAL.ALL_FIELDS_REQUIRED;
    }

    if (form.password !== form.confirmPassword) {
      return VALIDATION_MESSAGES.PASSWORD.MISMATCH;
    }

    if (form.password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      return VALIDATION_MESSAGES.PASSWORD.TOO_SHORT;
    }

    return null;
  };

  const handleLogin = async (form: LoginForm) => {
    const validationError = validateLoginForm(form);
    if (validationError) {
      setError(validationError);
      return false;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        mode: "signin",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました。");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (form: SignupForm) => {
    const validationError = validateSignupForm(form);
    if (validationError) {
      setError(validationError);
      return false;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        userName: form.userName,
        mode: "signup",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "アカウント作成に失敗しました。"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return {
    isLoading,
    error,
    setError,
    handleLogin,
    handleSignup,
    handleLogout,
    validateLoginForm,
    validateSignupForm,
  };
}
