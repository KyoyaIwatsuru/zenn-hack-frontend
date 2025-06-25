import React from "react";
import { FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";

interface UserHeaderProps {
  displayUserName: string | null;
  onProfileClick: () => void;
  onLogout: () => void;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function UserHeader({
  displayUserName,
  onProfileClick,
  onLogout,
  currentTab,
  onTabChange,
}: UserHeaderProps) {
  return (
    <div className="bg-main p-4 text-white">
      <div className="grid grid-cols-3 items-center">
        {/* 左側：フラッシュカードとユーザー情報（左寄せ） */}
        <div className="flex items-center gap-2 justify-self-start">
          <FileText className="h-6 w-6" />
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
                className="h-auto p-1 text-white transition-all duration-200 hover:scale-110 hover:bg-white/10"
                title="プロフィールを編集"
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* 中央：タブ（中央配置） */}
        <div className="justify-self-center">
          <Tabs value={currentTab} onValueChange={onTabChange}>
            <TabsList className="bg-white/10 text-white">
              <TabsTrigger
                value="all"
                className="data-[state=active]:text-main data-[state=active]:bg-white"
              >
                単語学習
              </TabsTrigger>
              <TabsTrigger
                value="generated"
                className="data-[state=active]:text-main data-[state=active]:bg-white"
              >
                画像選択
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 右側：ログアウトボタン（右寄せ） */}
        <div className="justify-self-end">
          <SimpleTooltip
            content="Logout"
            position="bottom"
            backgroundColor="bg-main"
          >
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <LogOut />
            </Button>
          </SimpleTooltip>
        </div>
      </div>
    </div>
  );
}
