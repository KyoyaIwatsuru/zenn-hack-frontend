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
}

export function QuestionMode({
  promptConditions,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
}: QuestionModeProps) {
  const getConditionLabel = (type: string) => {
    const labels: Record<string, string> = {
      taste: "どんなテイスト？",
      style: "どんなスタイル？",
      mood: "どんな雰囲気？",
      character: "登場人物は？",
      setting: "どんな場所？",
      time: "いつの時代？",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-4">
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
              <SelectItem value="taste">どんなテイスト？</SelectItem>
              <SelectItem value="style">どんなスタイル？</SelectItem>
              <SelectItem value="mood">どんな雰囲気？</SelectItem>
              <SelectItem value="character">登場人物は？</SelectItem>
              <SelectItem value="setting">どんな場所？</SelectItem>
              <SelectItem value="time">いつの時代？</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="回答を記入"
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
