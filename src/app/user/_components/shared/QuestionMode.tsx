import React from "react";
import { Plus, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AVAILABLE_QUESTION_TYPES, QUESTION_LABELS } from "@/constants";
import { PromptCondition } from "./types";

interface QuestionModeProps {
  promptConditions: PromptCondition[];
  onAddCondition: () => void;
  onRemoveCondition: (id: string) => void;
  onUpdateCondition: (
    id: string,
    field: "type" | "value",
    newValue: string
  ) => void;
  usedTypes: string[];
}

export function QuestionMode({
  promptConditions,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
  usedTypes,
}: QuestionModeProps) {
  const getConditionLabel = (type: string) => {
    return QUESTION_LABELS[type as keyof typeof QUESTION_LABELS] || type;
  };

  const getPlaceholderText = (type: string) => {
    const placeholders: Record<string, string> = {
      taste: "例: アニメイラスト風、水彩画風、写実的",
      style: "例: かわいい、クール、エレガント",
      mood: "例: 明るい、神秘的、穏やか",
      character: "例: 猫、女性、子供",
      setting: "例: 公園、家の中、森",
      time: "例: 現代、中世、未来",
      other: "例: 猫は三毛猫にして、和室の廊下を歩いている様子にして",
    };
    return placeholders[type] || "回答を記入";
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-gray-700">
          質問に答えることでMedia作成のためのプロンプトが自動作成されます。
        </h4>
        <p className="text-xs text-gray-500">
          各項目は任意です。より詳細に指定することで、理想的なMediaに近づきます。
        </p>
      </div>
      {promptConditions.map((condition) => (
        <div key={condition.id} className="flex gap-2">
          <Select
            value={condition.type}
            onValueChange={(value) =>
              onUpdateCondition(condition.id, "type", value)
            }
          >
            <SelectTrigger className="bg-primary w-40">
              <SelectValue placeholder={getConditionLabel(condition.type)} />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_QUESTION_TYPES.map((questionType) => {
                // 「その他」は常に利用可能
                if (questionType.value === "other") {
                  return (
                    <SelectItem
                      key={questionType.value}
                      value={questionType.value}
                    >
                      {questionType.label}
                    </SelectItem>
                  );
                }

                // 現在の条件のタイプは利用可能
                if (questionType.value === condition.type) {
                  return (
                    <SelectItem
                      key={questionType.value}
                      value={questionType.value}
                    >
                      {questionType.label}
                    </SelectItem>
                  );
                }

                // まだ使用されていないタイプのみ利用可能
                if (!usedTypes.includes(questionType.value)) {
                  return (
                    <SelectItem
                      key={questionType.value}
                      value={questionType.value}
                    >
                      {questionType.label}
                    </SelectItem>
                  );
                }

                // 使用済みタイプは表示しない
                return null;
              })}
            </SelectContent>
          </Select>
          <Input
            placeholder={getPlaceholderText(condition.type)}
            value={condition.value}
            onChange={(e) =>
              onUpdateCondition(condition.id, "value", e.target.value)
            }
            className="bg-primary focus:border-main flex-1 border-gray-200"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveCondition(condition.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Trash2Icon />
          </Button>
        </div>
      ))}

      <Button
        variant="ghost"
        onClick={onAddCondition}
        className="text-main hover:text-main hover:bg-sub/20 mt-4"
      >
        <Plus className="mr-2 h-4 w-4" />
        条件を追加する
      </Button>
    </div>
  );
}
