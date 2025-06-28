import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, X } from "lucide-react";
import { LoadingSpinner } from "@/components/shared";

export interface VisibilitySettings {
  word: boolean;
  image: boolean;
  meanings: boolean;
  examples: boolean;
  explanation: boolean;
}

interface VisibilityControlPanelProps {
  visibilitySettings: VisibilitySettings;
  onVisibilityChange: (settings: VisibilitySettings) => void;
  isApplying: boolean;
  appliedCardsCount?: number;
  totalCardsCount?: number;
}

export function VisibilityControlPanel({
  visibilitySettings,
  onVisibilityChange,
  isApplying,
  appliedCardsCount: _appliedCardsCount = 0,
  totalCardsCount: _totalCardsCount = 0,
}: VisibilityControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingSettings, setPendingSettings] =
    useState<VisibilitySettings>(visibilitySettings);
  const [hasChanges, setHasChanges] = useState(false);

  // 設定の変更を検知
  React.useEffect(() => {
    const settingsChanged =
      JSON.stringify(pendingSettings) !== JSON.stringify(visibilitySettings);
    setHasChanges(settingsChanged);
  }, [pendingSettings, visibilitySettings]);

  const toggleSetting = (key: keyof VisibilitySettings) => {
    setPendingSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const applyPreset = (preset: "wordOnly" | "showAll") => {
    if (preset === "wordOnly") {
      setPendingSettings({
        word: true,
        image: false,
        meanings: false,
        examples: false,
        explanation: false,
      });
    } else {
      setPendingSettings({
        word: true,
        image: true,
        meanings: true,
        examples: true,
        explanation: true,
      });
    }
  };

  const handleApply = () => {
    onVisibilityChange(pendingSettings);
  };

  const handleReset = () => {
    setPendingSettings(visibilitySettings);
  };

  return (
    <div className="relative">
      {/* メインボタン */}
      <Button
        variant="cream"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={isApplying}
        className="flex items-center gap-2"
      >
        {isApplying ? (
          <LoadingSpinner />
        ) : isExpanded ? (
          <X className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        {isExpanded && (
          <span className="text-xs whitespace-nowrap">閉じる</span>
        )}
      </Button>

      {/* 展開されたパネル - メインボタンの下部 */}
      {isExpanded && (
        <div className="absolute top-full left-0 z-50 mt-2">
          <Card className="bg-white shadow-lg">
            <CardContent className="space-y-4 p-4">
              {/* 個別制御ボタン */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSetting("word")}
                    disabled={isApplying}
                    className="h-8 w-8 p-0 hover:bg-black hover:text-white"
                  >
                    {pendingSettings.word ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="text-xs text-gray-700">英単語</span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSetting("image")}
                    disabled={isApplying}
                    className="h-8 w-8 p-0 hover:bg-black hover:text-white"
                  >
                    {pendingSettings.image ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="text-xs text-gray-700">画像</span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSetting("meanings")}
                    disabled={isApplying}
                    className="h-8 w-8 p-0 hover:bg-black hover:text-white"
                  >
                    {pendingSettings.meanings ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="text-xs text-gray-700">意味</span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSetting("examples")}
                    disabled={isApplying}
                    className="h-8 w-8 p-0 hover:bg-black hover:text-white"
                  >
                    {pendingSettings.examples ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="text-xs text-gray-700">例文</span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSetting("explanation")}
                    disabled={isApplying}
                    className="h-8 w-8 p-0 hover:bg-black hover:text-white"
                  >
                    {pendingSettings.explanation ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  <span className="text-xs text-gray-700">説明</span>
                </div>
              </div>

              {/* プリセットボタン */}
              <div className="space-y-2 border-t pt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => applyPreset("wordOnly")}
                  disabled={isApplying}
                  className="w-full text-xs"
                >
                  単語だけ表示
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => applyPreset("showAll")}
                  disabled={isApplying}
                  className="w-full text-xs"
                >
                  すべて表示
                </Button>
              </div>

              {/* 適用・リセットボタン */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex gap-2">
                  <Button
                    variant="green"
                    size="sm"
                    onClick={handleApply}
                    disabled={isApplying || !hasChanges}
                    className="flex-1 text-xs"
                  >
                    適用
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={isApplying || !hasChanges}
                    className="flex-1 text-xs"
                  >
                    リセット
                  </Button>
                </div>
              </div>

              {/* 適用中の表示 */}
              {isApplying && (
                <div className="border-t pt-3 text-center">
                  <p className="text-custom-sub text-xs">
                    すべてのカードに
                    <br />
                    適用中...
                  </p>
                  <div className="text-main mt-2 text-xs">
                    {_appliedCardsCount}/{_totalCardsCount}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
