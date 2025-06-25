import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flashcard, Meaning, ComparisonUpdateRequest } from "@/types";
import { MediaCreateResult } from "@/types/ui";
import { ErrorMessage } from "@/components/shared";
import { FlashcardItem } from "./FlashcardItem";
import { useComparison } from "@/hooks";

interface ComparisonUpdateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: Flashcard | null;
  selectedMeaning: Meaning | null;
  mediaCreateResults: Record<string, MediaCreateResult>;
  onMeaningSelect: (meaningId: string) => void;
  onComparisonComplete: (flashcardId: string) => void;
}

export function ComparisonUpdateModal({
  isOpen,
  onOpenChange,
  flashcard,
  selectedMeaning,
  mediaCreateResults,
  onMeaningSelect,
  onComparisonComplete,
}: ComparisonUpdateModalProps) {
  const {
    isUpdating,
    error: comparisonError,
    updateResult,
    updateComparison,
    resetState,
  } = useComparison();

  // 更新成功時の処理
  useEffect(() => {
    if (updateResult === true && flashcard) {
      onComparisonComplete(flashcard.flashcardId);
      onOpenChange(false);
      resetState();
    }
  }, [updateResult, flashcard, onComparisonComplete, onOpenChange, resetState]);

  // モーダルが閉じられた時の状態リセット
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  if (!flashcard || !selectedMeaning) {
    return null;
  }

  // 現在のフラッシュカードに対応するメディア生成結果を取得
  const currentMediaResult = mediaCreateResults[flashcard.flashcardId];

  if (!currentMediaResult) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="bg-whole max-w-md">
          <DialogHeader>
            <DialogTitle className="text-custom">
              生成データが見つかりません
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="mb-4 text-gray-500">
              このフラッシュカードの生成データが見つかりません。
            </p>
            <Button onClick={() => onOpenChange(false)}>閉じる</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSelectCurrent = async () => {
    if (!currentMediaResult) return;

    const request: ComparisonUpdateRequest = {
      flashcardId: flashcard.flashcardId,
      comparisonId: currentMediaResult.comparisonId,
      oldMediaId: flashcard.media?.mediaId || "",
      newMediaId: currentMediaResult.newMediaId,
      isSelectedNew: false, // 現在の画像を選択
    };

    await updateComparison(request);
  };

  const handleSelectNew = async () => {
    if (!currentMediaResult) return;

    const request: ComparisonUpdateRequest = {
      flashcardId: flashcard.flashcardId,
      comparisonId: currentMediaResult.comparisonId,
      oldMediaId: flashcard.media?.mediaId || "",
      newMediaId: currentMediaResult.newMediaId,
      isSelectedNew: true, // 新しい画像を選択
    };

    await updateComparison(request);
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
        <DialogHeader>
          <DialogTitle className="text-custom mb-4 text-xl">
            画像選択（使用したいカードを選択してください）
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* 現在の画像のフラッシュカード */}
          <div>
            <h3 className="text-custom mb-3 text-lg font-semibold">
              現在の画像
            </h3>
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
              showCheckbox={false}
              showMeaningActions={false}
              showMemo={false}
              enableMeaningSelect={false}
              enableMediaClick={false}
              enableMemoEdit={false}
              borderColor="border-blue"
            />
          </div>

          {/* 新しく生成された画像のフラッシュカード */}
          <div>
            <h3 className="text-custom mb-3 text-lg font-semibold">
              生成された新しい画像
            </h3>
            <FlashcardItem
              flashcard={{
                ...flashcard,
                media: {
                  mediaId: currentMediaResult.newMediaId,
                  mediaUrls: currentMediaResult.newMediaUrls,
                  meaningId: selectedMeaning.meaningId,
                },
              }}
              selectedMeaning={selectedMeaning}
              onCheckFlagToggle={() => {}} // 機能無効化のため空関数
              onMeaningSelect={() => {}} // 機能無効化のため空関数
              onMeaningAdded={() => {}} // 機能無効化のため空関数
              onMeaningDeleted={() => {}} // 機能無効化のため空関数
              onMediaClick={() => {}} // 機能無効化のため空関数
              onMemoEdit={() => {}} // 機能無効化のため空関数
              showCheckbox={false}
              showMeaningActions={false}
              showMemo={false}
              enableMediaClick={false}
              enableMeaningSelect={false}
              enableMemoEdit={false}
              borderColor="border-red"
            />
          </div>

          {/* エラー表示 */}
          {comparisonError && (
            <ErrorMessage
              message={comparisonError}
              onRetry={() => resetState()}
              retryText="エラーをクリア"
            />
          )}

          {/* 選択ボタン */}
          <div className="border-t pt-8">
            <p className="text-custom mb-6 text-center text-lg">
              どちらの画像を使用しますか？
            </p>

            <div className="grid grid-cols-2 gap-8">
              <Button
                variant="outline"
                onClick={handleSelectCurrent}
                disabled={isUpdating}
                className="border-blue text-blue h-12 text-lg hover:bg-blue-50"
              >
                {isUpdating ? "更新中..." : "現在の画像を選択"}
              </Button>
              <Button
                variant="outline"
                onClick={handleSelectNew}
                disabled={isUpdating}
                className="border-red text-red h-12 text-lg hover:bg-red-50"
              >
                {isUpdating ? "更新中..." : "新しい画像を選択"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
