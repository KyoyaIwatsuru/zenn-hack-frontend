import React, { useState, useEffect } from "react";
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
import { Flashcard, Meaning, Template } from "@/types";
import { DEFAULT_VALUES, API_ENDPOINTS } from "@/constants";
import { httpClient, ErrorHandler } from "@/lib";
import { FlashcardDisplay } from "./FlashcardDisplay";
import { ModelSelectionButton } from "./ModelSelectionButton";
import { QuestionMode, PromptMode, PromptCondition } from "./shared";
import { LoadingSpinner, ErrorMessage } from "@/components/shared";

interface MediaCreateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: Flashcard | null;
  selectedMeaning: Meaning | null;
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  onTemplatesRetry: () => void;
  onMeaningSelect: (meaningId: string) => void;
  onMediaGenerated: (flashcardId: string, media: unknown) => void;
}

export function MediaCreateModal({
  isOpen,
  onOpenChange,
  flashcard,
  selectedMeaning,
  templates,
  isLoading,
  error,
  onTemplatesRetry,
  onMeaningSelect,
  onMediaGenerated,
}: MediaCreateModalProps) {
  const [selectedModel, setSelectedModel] = useState("text-to-image");
  const [descriptionTarget, setDescriptionTarget] = useState("");
  const [editFormat, setEditFormat] = useState("question");
  const [promptConditions, setPromptConditions] = useState<PromptCondition[]>([
    { id: "1", type: "taste", value: "" },
    { id: "2", type: "character", value: "" },
  ]);
  const [promptText, setPromptText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // 選択されたモデルに対応する利用可能なTargetを取得
  const getAvailableTargets = () => {
    return templates
      .filter((template) => template.generationType === selectedModel)
      .map((template) => template.target)
      .filter((value, index, self) => self.indexOf(value) === index); // 重複除去
  };

  const availableTargets = getAvailableTargets();

  // モデル変更時に利用可能な最初のTargetに自動設定
  useEffect(() => {
    if (availableTargets.length > 0) {
      const currentTargetExists = availableTargets.includes(descriptionTarget);
      if (!currentTargetExists) {
        setDescriptionTarget(availableTargets[0]);
      }
    }
  }, [selectedModel, templates, descriptionTarget, availableTargets]);

  // Template自動選択ロジック
  useEffect(() => {
    const template = templates.find(
      (t) =>
        t.generationType === selectedModel && t.target === descriptionTarget
    );

    if (template) {
      setSelectedTemplate(template);
      setPromptText(template.preText);
    } else {
      setSelectedTemplate(null);
      // フォールバック用のデフォルトプロンプト
      setPromptText(
        "画像生成AIを用いて，以下で指示する画像を生成するためのプロンプトを英語で出力してください．\nプロンプトは，「An Illustration of ~」から始まる文章で，なるべく詳細に記述してください．\n\n###画像の指示\n以下の例文を適切に表現しており，以下の{pos}の英単語「{word}」に関する解説文の内容も考慮した画像．\n\n###例文\n{example}\n\n###解説文\n{explanation}"
      );
    }
  }, [selectedModel, descriptionTarget, templates]);

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
      templateId: selectedTemplate?.templateId || DEFAULT_VALUES.TEMPLATE_ID,
      userPrompt,
      allowGeneratingPerson: true,
      inputMediaUrls:
        selectedModel === "image-to-image"
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
                      modelType="text-to-image"
                      isSelected={selectedModel === "text-to-image"}
                      onClick={() => setSelectedModel("text-to-image")}
                    />
                    <ModelSelectionButton
                      modelType="image-to-image"
                      isSelected={selectedModel === "image-to-image"}
                      onClick={() => setSelectedModel("image-to-image")}
                    />
                    <ModelSelectionButton
                      modelType="text-to-video"
                      isSelected={selectedModel === "text-to-video"}
                      onClick={() => setSelectedModel("text-to-video")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-custom mb-2 block text-sm font-medium">
                    描写対象 <span className="text-gray-400">ⓘ</span>
                  </label>
                  {isLoading ? (
                    <LoadingSpinner
                      message="テンプレート読み込み中..."
                      size="small"
                    />
                  ) : error ? (
                    <ErrorMessage
                      message={error}
                      onRetry={onTemplatesRetry}
                      retryText="テンプレート再読み込み"
                    />
                  ) : (
                    <Select onValueChange={setDescriptionTarget}>
                      <SelectTrigger className="bg-primary">
                        <SelectValue placeholder="描写対象を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTargets.map((target) => (
                          <SelectItem key={target} value={target}>
                            {target}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div>
                  <label className="text-custom mb-2 block text-sm font-medium">
                    編集形式 <span className="text-gray-400">ⓘ</span>
                  </label>
                  <Select onValueChange={setEditFormat}>
                    <SelectTrigger className="bg-primary">
                      <SelectValue placeholder="編集形式を選択" />
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
                disabled={isGenerating || isLoading || !!error}
                className="bg-main hover-green px-6 py-3 text-base text-white"
              >
                <span className="flex items-center gap-2">
                  <Bot className="h-8 w-8" />
                  {isGenerating
                    ? "生成中..."
                    : isLoading
                      ? "テンプレート読み込み中..."
                      : "画像を生成"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
