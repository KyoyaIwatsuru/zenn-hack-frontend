import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-primary flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <FileText className="text-main h-8 w-8" />
            <span className="text-custom text-2xl font-bold">
              フラッシュカード
            </span>
          </div>
          <CardTitle className="text-custom">アカウント</CardTitle>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
