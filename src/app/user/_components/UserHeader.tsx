import React from "react";
import { FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserHeaderProps {
  displayUserName: string | null;
  onProfileClick: () => void;
  onLogout: () => void;
}

export function UserHeader({
  displayUserName,
  onProfileClick,
  onLogout,
}: UserHeaderProps) {
  return (
    <div className="bg-main text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          <span className="font-medium">フラッシュカード</span>
          {displayUserName && (
            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm opacity-90">
                ようこそ、{displayUserName}さん
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onProfileClick}
                className="text-white hover:bg-white/10 p-1 h-auto transition-all duration-200 hover:scale-110"
                title="プロフィールを編集"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={onLogout}
          className="text-white hover:bg-white/10"
        >
          ログアウト
        </Button>
      </div>
    </div>
  );
}