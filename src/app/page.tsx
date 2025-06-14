"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ログインフォーム
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // サインアップフォーム
  const [signupForm, setSignupForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ダミー認証 - 簡単なバリデーション
      if (loginForm.email.length === 0 || loginForm.password.length === 0) {
        throw new Error("メールアドレスとパスワードを入力してください");
      }

      // ダミーのユーザーID生成（メールアドレスベース）
      const userId =
        "user_" +
        btoa(loginForm.email)
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(0, 10);

      // ローカルストレージにユーザーIDを保存
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", loginForm.email);

      // ログイン成功後、ユーザーページに移動
      setTimeout(() => {
        router.push("/user");
        setIsLoading(false);
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました。");
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("パスワードが一致しません。");
      setIsLoading(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setError("パスワードは6文字以上で入力してください。");
      setIsLoading(false);
      return;
    }

    try {
      // ダミー認証 - バリデーション
      if (!signupForm.email || !signupForm.username || !signupForm.password) {
        throw new Error("すべての項目を入力してください");
      }

      // ダミーのユーザーID生成（メールアドレスベース）
      const userId =
        "user_" +
        btoa(signupForm.email)
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(0, 10);

      // ローカルストレージにユーザー情報を保存
      localStorage.setItem("userId", userId);
      localStorage.setItem("userEmail", signupForm.email);
      localStorage.setItem("userName", signupForm.username);

      // サインアップ成功後、ユーザーページに移動
      setTimeout(() => {
        router.push("/user");
        setIsLoading(false);
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "アカウント作成に失敗しました。"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-main" />
            <span className="text-2xl font-bold text-custom">
              フラッシュカード
            </span>
          </div>
          <CardTitle className="text-custom">アカウント</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">ログイン</TabsTrigger>
              <TabsTrigger value="signup">サインアップ</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-custom">
                    メールアドレス
                  </label>
                  <Input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
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
                    パスワード
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
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

                <Button
                  type="submit"
                  className="w-full bg-main hover:bg-main/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "ログイン中..." : "ログイン"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
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
                    value={signupForm.username}
                    onChange={(e) =>
                      setSignupForm((prev) => ({
                        ...prev,
                        username: e.target.value,
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

                <Button
                  type="submit"
                  className="w-full bg-main hover:bg-main/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "アカウント作成中..." : "アカウント作成"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
