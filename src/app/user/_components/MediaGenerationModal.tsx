import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Flashcard, Meaning } from "@/types/type";
import { FlashcardDisplay } from "./FlashcardDisplay";
import { mockFlashcardService } from "@/services/mockService";

interface MediaGenerationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: Flashcard | null;
  selectedMeaning: Meaning | null;
  onMeaningSelect: (meaningId: string) => void;
  onMediaGenerated: (flashcardId: string, media: unknown) => void;
}

interface PromptCondition {
  id: string;
  type: string;
  value: string;
}

export function MediaGenerationModal({
  isOpen,
  onOpenChange,
  flashcard,
  selectedMeaning,
  onMeaningSelect,
  onMediaGenerated,
}: MediaGenerationModalProps) {
  const [selectedModel, setSelectedModel] = useState("text2image");
  const [descriptionTarget, setDescriptionTarget] = useState("example");
  const [editFormat, setEditFormat] = useState("question");
  const [promptConditions, setPromptConditions] = useState<PromptCondition[]>([
    { id: "1", type: "taste", value: "" },
    { id: "2", type: "character", value: "" },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!flashcard || !selectedMeaning) {
    return null;
  }

  // 条件を追加
  const addCondition = () => {
    const newCondition: PromptCondition = {
      id: Date.now().toString(),
      type: "taste",
      value: "",
    };
    setPromptConditions([...promptConditions, newCondition]);
  };

  // 条件を削除
  const removeCondition = (id: string) => {
    setPromptConditions(
      promptConditions.filter((condition) => condition.id !== id)
    );
  };

  // 条件の値を更新
  const updateCondition = (
    id: string,
    field: "type" | "value",
    newValue: string
  ) => {
    setPromptConditions(
      promptConditions.map((condition) =>
        condition.id === id ? { ...condition, [field]: newValue } : condition
      )
    );
  };

  // 画像生成
  const handleGenerateMedia = async () => {
    setIsGenerating(true);

    try {
      // プロンプトを構築
      const userPrompt = promptConditions
        .filter((condition) => condition.value.trim())
        .map((condition) => `${condition.type}: ${condition.value}`)
        .join(", ");

      const requestData = {
        userId: localStorage.getItem("userId") || "",
        flashcardId: flashcard.flashcardId,
        meaningId: selectedMeaning.meaningId,
        generationType: selectedModel,
        templateId: "default-template", // 後でテンプレート選択機能を追加
        userPrompt,
        inputMediaUrls:
          selectedModel === "image2image"
            ? flashcard.media?.mediaUrls
            : undefined,
      };

      const media = await mockFlashcardService.generateMedia(requestData);

      // 成功時の処理
      onMediaGenerated(flashcard.flashcardId, media);
      onOpenChange(false);
    } catch (error) {
      console.error("メディア生成エラー:", error);
      // エラーハンドリングをここに追加
    } finally {
      setIsGenerating(false);
    }
  };

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-[95vw] !w-[95vw] !max-h-[95vh] !h-[95vh] overflow-y-auto p-6"
        style={{
          maxWidth: "95vw",
          width: "95vw",
          maxHeight: "95vh",
          height: "95vh",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-custom text-xl mb-4">
            画像編集
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* フラッシュカード表示 */}
          <FlashcardDisplay
            flashcard={flashcard}
            selectedMeaning={selectedMeaning}
            onMeaningSelect={onMeaningSelect}
          />

          {/* 画像生成セクション */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold text-custom mb-6">画像生成</h3>

            <div className="grid grid-cols-2 gap-8">
              {/* 左側：モデル選択、描写対象、編集形式 */}
              <div className="space-y-6">
                {/* モデル選択 */}
                <div>
                  <label className="block text-sm font-medium text-custom mb-2">
                    モデル <span className="text-gray-400">ⓘ</span>
                  </label>
                  <div className="flex gap-3">
                    <div
                      className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer ${
                        selectedModel === "text2image"
                          ? "border-main bg-sub/20"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedModel("text2image")}
                    >
                      <div className="w-8 h-8 bg-green-400 rounded mb-1 flex items-center justify-center text-white text-xs">
                        画
                      </div>
                      <span className="text-xs font-medium text-custom">
                        text2image
                      </span>
                    </div>
                    <div
                      className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer ${
                        selectedModel === "image2image"
                          ? "border-main bg-sub/20"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedModel("image2image")}
                    >
                      <div className="w-8 h-8 bg-blue-400 rounded mb-1 flex items-center justify-center text-white text-xs">
                        編
                      </div>
                      <span className="text-xs font-medium text-custom">
                        image2image
                      </span>
                    </div>
                    <div
                      className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer ${
                        selectedModel === "text2video"
                          ? "border-main bg-sub/20"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedModel("text2video")}
                    >
                      <div className="w-8 h-8 bg-red-400 rounded mb-1 flex items-center justify-center text-white text-xs">
                        動
                      </div>
                      <span className="text-xs font-medium text-custom">
                        text2video
                      </span>
                    </div>
                  </div>
                </div>

                {/* 描写対象 */}
                <div>
                  <label className="block text-sm font-medium text-custom mb-2">
                    描写対象 <span className="text-gray-400">ⓘ</span>
                  </label>
                  <Select
                    value={descriptionTarget}
                    onValueChange={setDescriptionTarget}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="例文" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="example">例文</SelectItem>
                      <SelectItem value="core">コアミーニング</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 編集形式 */}
                <div>
                  <label className="block text-sm font-medium text-custom mb-2">
                    編集形式 <span className="text-gray-400">ⓘ</span>
                  </label>
                  <Select value={editFormat} onValueChange={setEditFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="質問" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">質問</SelectItem>
                      <SelectItem value="prompt">プロンプト</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 右側：プロンプト条件 */}
              <div className="space-y-4">
                {promptConditions.map((condition) => (
                  <div key={condition.id} className="flex gap-2">
                    <Select
                      value={condition.type}
                      onValueChange={(value) =>
                        updateCondition(condition.id, "type", value)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue
                          placeholder={getConditionLabel(condition.type)}
                        />
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
                        updateCondition(condition.id, "value", e.target.value)
                      }
                      className="flex-1 border-gray-200 focus:border-main"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCondition(condition.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      🗑️
                    </Button>
                  </div>
                ))}

                {/* 条件を追加するボタン */}
                <Button
                  variant="ghost"
                  onClick={addCondition}
                  className="text-main hover:text-main hover:bg-sub/20 mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  条件を追加する
                </Button>
              </div>
            </div>

            {/* 画像を生成ボタン */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleGenerateMedia}
                disabled={isGenerating}
                className="bg-main hover:bg-main/90 text-white px-8 py-3"
              >
                {isGenerating ? "生成中..." : "画像を生成"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
