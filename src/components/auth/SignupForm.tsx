import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks";

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { isLoading, error, handleSignup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSignup(signupForm);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-custom">
          メールアドレス
        </label>
        <Input
          type="email"
          value={signupForm.email}
          onChange={(e) =>
            setSignupForm((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          placeholder="example@email.com"
          required
          className="border-gray-200 focus:border-main"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-custom">
          ユーザー名
        </label>
        <Input
          type="text"
          value={signupForm.userName}
          onChange={(e) =>
            setSignupForm((prev) => ({
              ...prev,
              userName: e.target.value,
            }))
          }
          placeholder="ユーザー名を入力"
          required
          className="border-gray-200 focus:border-main"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-custom">
          パスワード
        </label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={signupForm.password}
            onChange={(e) =>
              setSignupForm((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            placeholder="パスワードを入力"
            required
            className="border-gray-200 focus:border-main pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-custom">
          パスワード確認
        </label>
        <Input
          type={showPassword ? "text" : "password"}
          value={signupForm.confirmPassword}
          onChange={(e) =>
            setSignupForm((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          placeholder="パスワードを再入力"
          required
          className="border-gray-200 focus:border-main"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-main hover:bg-main/90 text-white"
        disabled={isLoading}
      >
        {isLoading ? "アカウント作成中..." : "アカウント作成"}
      </Button>
    </form>
  );
}