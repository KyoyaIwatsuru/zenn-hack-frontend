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
import {
  Flashcard,
  Meaning,
  Template,
  MediaCreateRequest,
  GenerationType,
} from "@/types";
import { MediaCreateResult } from "@/types/ui";
import {
  DEFAULT_VALUES,
  BASE_TEMPLATE,
  AVAILABLE_QUESTION_TYPES,
} from "@/constants";
import { useMedia } from "@/hooks";
import { buildQuestionModePrompt } from "@/utils";
import { FlashcardItem } from "./FlashcardItem";
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
  onMediaCreateSuccess: (
    flashcardId: string,
    result: MediaCreateResult
  ) => void;
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
  onMediaCreateSuccess,
}: MediaCreateModalProps) {
  const {
    isCreating,
    error: mediaError,
    createdMedia,
    createMedia,
    resetState,
  } = useMedia();

  const [selectedModel, setSelectedModel] =
    useState<GenerationType>("text-to-image");
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
    } else {
      // 利用可能なTargetがない場合は空文字に設定
      setDescriptionTarget("");
    }
  }, [selectedModel, templates, descriptionTarget, availableTargets]);

  // Template自動選択とPromptText更新の統合ロジック
  useEffect(() => {
    let template = null;

    // 1. descriptionTargetが設定されている場合は完全一致で検索
    if (descriptionTarget) {
      const foundTemplate = templates.find(
        (t) =>
          t.generationType === selectedModel && t.target === descriptionTarget
      );
      template = foundTemplate || null;
    }

    // 2. 見つからない場合は同じgenerationTypeの最初のテンプレートを使用
    if (!template && templates.length > 0) {
      const fallbackTemplate = templates.find(
        (t) => t.generationType === selectedModel
      );
      template = fallbackTemplate || null;
    }

    // 3. テンプレート状態を更新
    setSelectedTemplate(template);

    // 4. PromptModeの場合のみpromptTextを更新
    if (editFormat === "prompt") {
      const templateText = template?.preText || BASE_TEMPLATE;
      setPromptText(templateText);
    }
  }, [selectedModel, descriptionTarget, templates, editFormat]);

  // メディア生成成功時の処理
  useEffect(() => {
    if (createdMedia && flashcard) {
      // 親にMediaCreateDataを渡す
      onMediaCreateSuccess(flashcard.flashcardId, {
        ...createdMedia,
        status: "success" as const,
      });
      resetState();
    }
  }, [createdMedia, flashcard, onMediaCreateSuccess, resetState]);

  // メディア生成エラー時の処理
  useEffect(() => {
    if (mediaError && flashcard) {
      onMediaCreateSuccess(flashcard.flashcardId, {
        comparisonId: "",
        newMediaId: "",
        newMediaUrls: [],
        status: "error" as const,
        error: mediaError,
      });
      resetState();
    }
  }, [mediaError, flashcard, onMediaCreateSuccess, resetState]);

  // モーダルが閉じられた時の状態リセット
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  if (!flashcard || !selectedMeaning) {
    return null;
  }

  // 現在使用されているタイプを取得（「その他」以外、指定されたIDを除く）
  const getUsedTypes = (excludeId?: string) => {
    return promptConditions
      .filter(
        (condition) => condition.id !== excludeId && condition.type !== "other"
      )
      .map((condition) => condition.type);
  };

  // 利用可能な次のタイプを取得
  const getNextAvailableType = () => {
    const usedTypes = getUsedTypes();
    const availableType = AVAILABLE_QUESTION_TYPES.find(
      (questionType) =>
        questionType.value !== "other" &&
        !usedTypes.includes(questionType.value)
    );
    return availableType ? availableType.value : "other";
  };

  const addCondition = () => {
    const newCondition: PromptCondition = {
      id: Date.now().toString(),
      type: getNextAvailableType(),
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
    // タイプ変更の場合、重複チェック
    if (field === "type" && newValue !== "other") {
      const usedTypes = getUsedTypes(id);
      if (usedTypes.includes(newValue)) {
        // 既に使用されているタイプへの変更は防ぐ
        return;
      }
    }

    setPromptConditions(
      promptConditions.map((condition) =>
        condition.id === id ? { ...condition, [field]: newValue } : condition
      )
    );
  };

  const handleGenerateMedia = async () => {
    if (!flashcard || !selectedMeaning) return;

    // QuestionModeの場合、「その他」項目を抽出してotherSettingsを作成
    const otherSettings: string[] = [];
    let filteredConditions = promptConditions;

    if (editFormat === "question") {
      filteredConditions = promptConditions.filter((condition) => {
        if (condition.type === "other" && condition.value.trim() !== "") {
          otherSettings.push(condition.value.trim());
          return false; // プロンプトからは除外
        }
        return true;
      });
    }

    // 選択されたモードに応じてプロンプトを構築
    const userPrompt =
      editFormat === "question"
        ? buildQuestionModePrompt(
            selectedTemplate?.preText || BASE_TEMPLATE,
            filteredConditions
          )
        : promptText;

    const requestData: MediaCreateRequest = {
      flashcardId: flashcard.flashcardId,
      oldMediaId: flashcard.media?.mediaId || "",
      meaningId: selectedMeaning.meaningId,
      pos: selectedMeaning.pos,
      word: flashcard.word.word,
      translation: selectedMeaning.translation,
      exampleJpn: selectedMeaning.exampleJpn,
      explanation: flashcard.word.explanation,
      coreMeaning: flashcard.word.coreMeaning || null,
      generationType: selectedModel,
      templateId: selectedTemplate?.templateId || DEFAULT_VALUES.TEMPLATE_ID,
      userPrompt,
      otherSettings: otherSettings.length > 0 ? otherSettings : null,
      allowGeneratingPerson: true,
      inputMediaUrls:
        (selectedModel === "image-to-image" ||
          selectedModel === "image-to-video") &&
        flashcard.media?.mediaUrls
          ? flashcard.media.mediaUrls
          : null,
    };

    // 即座にpending状態を設定してモーダルを閉じる
    onMediaCreateSuccess(flashcard.flashcardId, {
      comparisonId: "",
      newMediaId: "",
      newMediaUrls: [],
      status: "pending" as const,
    });

    // モーダルを閉じる
    onOpenChange(false);
    resetState();

    // 非同期でメディア作成を実行
    try {
      await createMedia(requestData);
    } catch (error) {
      // エラー時はuseEffectで処理される
      console.error("Media creation failed:", error);
    }
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
            <FlashcardItem
              flashcard={flashcard}
              selectedMeaning={selectedMeaning}
              onCheckFlagToggle={() => {}} // 機能無効化のため空関数
              onMeaningSelect={(flashcardId, meaningId) =>
                onMeaningSelect(meaningId)
              }
              onMeaningAdded={() => {}} // 機能無効化のため空関数
              onMeaningDeleted={() => {}} // 機能無効化のため空関数
              onMediaClick={() => {}} // 機能無効化のため空関数
              onMemoEdit={() => {}} // 機能無効化のため空関数
              showMeaningActions={false}
              showMemo={false}
              enableMediaClick={false}
              enableMemoEdit={false}
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
                    <ModelSelectionButton
                      modelType="image-to-video"
                      isSelected={selectedModel === "image-to-video"}
                      onClick={() => setSelectedModel("image-to-video")}
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
                  usedTypes={getUsedTypes()}
                />
              )}

              {editFormat === "prompt" && (
                <PromptMode
                  promptText={promptText}
                  onPromptTextChange={setPromptText}
                />
              )}
            </div>

            {/* メディア生成エラー表示 */}
            {mediaError && (
              <div className="mt-4">
                <ErrorMessage
                  message={mediaError}
                  onRetry={() => resetState()}
                  retryText="エラーをクリア"
                />
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleGenerateMedia}
                disabled={isCreating || isLoading || !!error || !!mediaError}
                className="bg-main hover-green px-6 py-3 text-base text-white"
              >
                <span className="flex items-center gap-2">
                  <Bot className="h-8 w-8" />
                  {isCreating
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
