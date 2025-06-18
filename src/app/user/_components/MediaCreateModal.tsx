import React, { useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flashcard, Meaning } from "@/types";
import { DEFAULT_VALUES, API_ENDPOINTS } from "@/constants";
import { httpClient, ErrorHandler } from "@/lib";
import { FlashcardDisplay } from "./FlashcardDisplay";
import { ModelSelectionButton } from "./ModelSelectionButton";
import { QuestionMode, PromptMode, PromptCondition } from "./shared";

interface MediaCreateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: Flashcard | null;
  selectedMeaning: Meaning | null;
  onMeaningSelect: (meaningId: string) => void;
  onMediaGenerated: (flashcardId: string, media: unknown) => void;
}

export function MediaCreateModal({
  isOpen,
  onOpenChange,
  flashcard,
  selectedMeaning,
  onMeaningSelect,
  onMediaGenerated,
}: MediaCreateModalProps) {
  const [selectedModel, setSelectedModel] = useState("text2image");
  const [descriptionTarget, setDescriptionTarget] = useState("example");
  const [editFormat, setEditFormat] = useState("question");
  const [promptConditions, setPromptConditions] = useState<PromptCondition[]>([
    { id: "1", type: "taste", value: "" },
    { id: "2", type: "character", value: "" },
  ]);
  const [promptText, setPromptText] = useState(
    "画像生成AIを用いて，以下で指示する画像を生成するためのプロンプトを英語で出力してください．\nプロンプトは，「An Illustration of ~」から始まる文章で，なるべく詳細に記述してください．\n\n###画像の指示\n以下の例文を適切に表現しており，以下の{pos}の英単語「{word}」に関する解説文の内容も考慮した画像．\n\n###例文\n{example}\n\n###解説文\n{explanation}"
  );
  const [isGenerating, setIsGenerating] = useState(false);

  if (!flashcard || !selectedMeaning) {
    return null;
  }

  const addCondition = () => {
    const newCondition: PromptCondition = {
      id: Date.now().toString(),
      type: "taste",
      value: "",
    };
    setPromptConditions([...promptConditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    setPromptConditions(
      promptConditions.filter((condition) => condition.id !== id)
    );
  };

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

  const handleGenerateMedia = async () => {
    setIsGenerating(true);

    const userPrompt = promptConditions
      .filter((condition) => condition.value.trim())
      .map((condition) => `${condition.type}: ${condition.value}`)
      .join(", ");

    const requestData = {
      flashcardId: flashcard.flashcardId,
      oldMediaId: flashcard.media?.mediaId || "",
      meaningId: selectedMeaning.meaningId,
      generationType: selectedModel,
      templateId: DEFAULT_VALUES.TEMPLATE_ID,
      userPrompt,
      allowGeneratingPerson: true,
      inputMediaUrls:
        selectedModel === "image2image"
          ? flashcard.media?.mediaUrls
          : undefined,
    };

    const response = await httpClient.post(
      API_ENDPOINTS.MEDIA.CREATE,
      requestData
    );

    if (response.success) {
      onMediaGenerated(flashcard.flashcardId, response.data);
      onOpenChange(false);
    } else {
      ErrorHandler.logError(response.error);
      console.error(
        "メディア生成エラー:",
        ErrorHandler.getUserFriendlyMessage(response.error)
      );
    }

    setIsGenerating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-whole !h-[95vh] !max-h-[95vh] !w-[70vw] !max-w-[95vw] overflow-y-auto p-6"
        style={{
          maxWidth: "95vw",
          width: "95vw",
          maxHeight: "95vh",
          height: "95vh",
        }}
      >
        <DialogTitle className="sr-only">画像編集</DialogTitle>
        {/*Title is not used in the UI, but required for accessibility: */}
        <div className="flex h-full flex-col">
          <div className="flex-shrink-0">
            <FlashcardDisplay
              flashcard={flashcard}
              selectedMeaning={selectedMeaning}
              onMeaningSelect={onMeaningSelect}
            />
          </div>

          <div className="bg-secondary -mx-6 mt-8 -mb-6 flex-1 rounded-t-3xl p-12 pt-8">
            <h3 className="text-custom mb-6 text-xl font-semibold">画像生成</h3>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-9">
                <div>
                  <label className="text-custom mb-2 block text-sm font-medium">
                    モデル <span className="text-custom">ⓘ</span>
                  </label>
                  <div className="flex gap-3">
                    <ModelSelectionButton
                      modelType="text2image"
                      isSelected={selectedModel === "text2image"}
                      onClick={() => setSelectedModel("text2image")}
                    />
                    <ModelSelectionButton
                      modelType="image2image"
                      isSelected={selectedModel === "image2image"}
                      onClick={() => setSelectedModel("image2image")}
                    />
                    <ModelSelectionButton
                      modelType="text2video"
                      isSelected={selectedModel === "text2video"}
                      onClick={() => setSelectedModel("text2video")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-custom mb-2 block text-sm font-medium">
                    描写対象 <span className="text-gray-400">ⓘ</span>
                  </label>
                  <Select
                    value={descriptionTarget}
                    onValueChange={setDescriptionTarget}
                  >
                    <SelectTrigger className="bg-primary">
                      <SelectValue placeholder="例文" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="example">例文</SelectItem>
                      <SelectItem value="core">コアミーニング</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-custom mb-2 block text-sm font-medium">
                    編集形式 <span className="text-gray-400">ⓘ</span>
                  </label>
                  <Select value={editFormat} onValueChange={setEditFormat}>
                    <SelectTrigger className="bg-primary">
                      <SelectValue placeholder="質問" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">質問</SelectItem>
                      <SelectItem value="prompt">プロンプト</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editFormat === "question" && (
                <QuestionMode
                  promptConditions={promptConditions}
                  onAddCondition={addCondition}
                  onRemoveCondition={removeCondition}
                  onUpdateCondition={updateCondition}
                />
              )}

              {editFormat === "prompt" && (
                <PromptMode
                  promptText={promptText}
                  onPromptTextChange={setPromptText}
                />
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleGenerateMedia}
                disabled={isGenerating}
                className="bg-main hover-green px-6 py-3 text-base text-white"
              >
                <span className="flex items-center gap-2">
                  <Bot className="h-8 w-8" />
                  {isGenerating ? "生成中..." : "画像を生成"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
