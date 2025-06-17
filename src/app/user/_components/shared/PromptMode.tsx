import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface PromptModeProps {
  promptText: string;
  onPromptTextChange: (text: string) => void;
}

export function PromptMode({
  promptText,
  onPromptTextChange,
}: PromptModeProps) {
  return (
    <div className="space-y-4">
      <label className="text-custom block text-sm font-medium">
        プロンプト編集
      </label>
      <Textarea
        value={promptText}
        onChange={(e) => onPromptTextChange(e.target.value)}
        className="bg-primary focus:border-main min-h-[200px] border-gray-200"
        placeholder="プロンプトを入力してください..."
      />
    </div>
  );
}
