import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
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
          {children}
        </CardContent>
      </Card>
    </div>
  );
}