import React from "react";
import { FileText, User, Paintbrush, FileCheck, BookOpen } from "lucide-react";
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
  // 暗記モード用のコントロールパネル
  memorizationControlPanel?: React.ReactNode;
}

export function UserHeader({
  displayUserName,
  onProfileClick,
  onLogout,
  currentTab,
  onTabChange,
  memorizationControlPanel,
}: UserHeaderProps) {
  return (
    <div className="bg-main sticky top-0 z-50 p-4 text-white">
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
        <div className="relative justify-self-center">
          <Tabs value={currentTab} onValueChange={onTabChange}>
            <TabsList className="bg-white/10 text-white">
              <TabsTrigger
                value="all"
                className="data-[state=active]:text-main data-[state=active]:bg-white"
              >
                <div className="flex items-center gap-2">
                  <Paintbrush className="h-4 w-4" />
                  <span>作成</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="generated"
                className="data-[state=active]:text-main data-[state=active]:bg-white"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span>比較</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="memorization"
                className="data-[state=active]:text-main data-[state=active]:bg-white"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>学習</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 暗記モード時のコントロールパネル - タブの右側に絶対位置で配置 */}
          {currentTab === "memorization" && memorizationControlPanel && (
            <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2">
              {memorizationControlPanel}
            </div>
          )}
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
