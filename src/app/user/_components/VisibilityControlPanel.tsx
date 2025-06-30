import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, X } from "lucide-react";
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

// 個別制御ボタンの定義
const VISIBILITY_CONTROLS = [
  { key: "word" as keyof VisibilitySettings, label: "英単語" },
  { key: "image" as keyof VisibilitySettings, label: "Media" },
  { key: "meanings" as keyof VisibilitySettings, label: "意味" },
  { key: "examples" as keyof VisibilitySettings, label: "例文" },
  { key: "explanation" as keyof VisibilitySettings, label: "説明" },
] as const;

// プリセットボタンの定義
const PRESET_CONTROLS = [
  { key: "wordOnly" as const, label: "単語だけ表示" },
  { key: "showAll" as const, label: "すべて表示" },
] as const;

type PresetName = (typeof PRESET_CONTROLS)[number]["key"];

// プリセットボタンコンポーネント
interface PresetButtonProps {
  preset: PresetName;
  label: string;
  onApply: (preset: PresetName) => void;
  disabled: boolean;
}

const PresetButton: React.FC<PresetButtonProps> = ({
  preset,
  label,
  onApply,
  disabled,
}) => (
  <Button
    variant="secondary"
    size="sm"
    onClick={() => onApply(preset)}
    disabled={disabled}
    className="w-full text-xs"
  >
    {label}
  </Button>
);

// 適用・リセットボタンコンポーネント
interface ActionButtonsProps {
  onApply: () => void;
  onReset: () => void;
  isApplying: boolean;
  hasChanges: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onApply,
  onReset,
  isApplying,
  hasChanges,
}) => (
  <div className="space-y-2 border-t pt-3">
    <div className="flex gap-2">
      <Button
        variant="green"
        size="sm"
        onClick={onApply}
        disabled={isApplying || !hasChanges}
        className="flex-1 text-xs"
      >
        適用
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        disabled={isApplying || !hasChanges}
        className="flex-1 text-xs"
      >
        リセット
      </Button>
    </div>
  </div>
);

// 個別制御ボタンコンポーネント
interface VisibilityControlButtonProps {
  setting: keyof VisibilitySettings;
  label: string;
  isVisible: boolean;
  onToggle: (setting: keyof VisibilitySettings) => void;
  disabled: boolean;
}

const VisibilityControlButton: React.FC<VisibilityControlButtonProps> = ({
  setting,
  label,
  isVisible,
  onToggle,
  disabled,
}) => (
  <div className="flex items-center gap-3">
    <Button
      variant="outline"
      size="sm"
      onClick={() => onToggle(setting)}
      disabled={disabled}
      className="h-8 w-8 p-0 hover:bg-black hover:text-white"
    >
      {isVisible ? (
        <Eye className="h-3 w-3" />
      ) : (
        <EyeClosed className="h-3 w-3" />
      )}
    </Button>
    <span className="text-xs text-gray-700">{label}</span>
  </div>
);

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
          <X className="size-4" />
        ) : (
          <Eye className="size-5" />
        )}
        {isExpanded && (
          <span className="text-xs whitespace-nowrap">閉じる</span>
        )}
      </Button>

      {/* 展開されたパネル - メインボタンの下部 */}
      {isExpanded && (
        <div className="absolute top-full left-0 z-50 mt-2">
          <Card className="bg-primary shadow-lg">
            <CardContent className="space-y-4 p-4">
              {/* 個別制御ボタン */}
              <div className="space-y-2">
                {VISIBILITY_CONTROLS.map(({ key, label }) => (
                  <VisibilityControlButton
                    key={key}
                    setting={key}
                    label={label}
                    isVisible={pendingSettings[key]}
                    onToggle={toggleSetting}
                    disabled={isApplying}
                  />
                ))}
              </div>

              {/* プリセットボタン */}
              <div className="space-y-2 border-t pt-3">
                {PRESET_CONTROLS.map(({ key, label }) => (
                  <PresetButton
                    key={key}
                    preset={key}
                    label={label}
                    onApply={applyPreset}
                    disabled={isApplying}
                  />
                ))}
              </div>

              {/* 適用・リセットボタン */}
              <ActionButtons
                onApply={handleApply}
                onReset={handleReset}
                isApplying={isApplying}
                hasChanges={hasChanges}
              />

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
