"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthLayout, LoginForm, SignupForm } from "@/components/auth";
import { LoadingSpinner } from "@/components/shared";

export default function AuthPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // 認証済みの場合は/userにリダイレクト
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/user");
    }
  }, [session, status, router]);

  // 認証状態を確認中の場合はローディング表示
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // 既に認証済みの場合は何も表示しない（リダイレクト待ち）
  if (status === "authenticated") {
    return null;
  }

  return (
    <AuthLayout>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">ログイン</TabsTrigger>
          <TabsTrigger value="signup">サインアップ</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <LoginForm />
        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}