import React, { useEffect, useState } from "react";
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

// 確認ダイアログコンポーネント
function ConfirmationDialog({
  isOpen,
  onOpenChange,
  isCurrentImage,
  onConfirm,
  isUpdating,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isCurrentImage: boolean;
  onConfirm: () => void;
  isUpdating: boolean;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-whole max-w-md">
        <DialogHeader>
          <DialogTitle className="text-custom">画像選択の確認</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-custom mb-6 text-center">
            {isCurrentImage ? "現在の画像" : "新しい画像"}を選択しますか？
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              いいえ
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isUpdating}
              className={
                isCurrentImage
                  ? "bg-blue hover-blue text-white"
                  : "bg-red hover-red text-white"
              }
            >
              {isUpdating ? "更新中..." : "はい"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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

  // 確認ダイアログの状態
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isCurrentImageSelected, setIsCurrentImageSelected] = useState(false);

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
      setIsConfirmationOpen(false);
    }
  }, [isOpen, resetState]);

  // フラッシュカードクリック時の処理
  const handleCurrentImageClick = () => {
    setIsCurrentImageSelected(true);
    setIsConfirmationOpen(true);
  };

  const handleNewImageClick = () => {
    setIsCurrentImageSelected(false);
    setIsConfirmationOpen(true);
  };

  // 確認ダイアログでの実際の選択処理
  const handleConfirmSelection = async () => {
    if (!currentMediaResult || !flashcard) return;

    const request: ComparisonUpdateRequest = {
      flashcardId: flashcard.flashcardId,
      comparisonId: currentMediaResult.comparisonId,
      oldMediaId: flashcard.media?.mediaId || "",
      newMediaId: currentMediaResult.newMediaId,
      isSelectedNew: !isCurrentImageSelected,
    };

    await updateComparison(request);
    setIsConfirmationOpen(false);
  };

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
            <div
              onClick={handleCurrentImageClick}
              className="cursor-pointer transition-transform hover:scale-105"
            >
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
          </div>

          {/* 新しく生成された画像のフラッシュカード */}
          <div>
            <h3 className="text-custom mb-3 text-lg font-semibold">
              生成された新しい画像
            </h3>
            <div
              onClick={handleNewImageClick}
              className="cursor-pointer transition-transform hover:scale-105"
            >
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
          </div>

          {/* エラー表示 */}
          {comparisonError && (
            <ErrorMessage
              message={comparisonError}
              onRetry={() => resetState()}
              retryText="エラーをクリア"
            />
          )}
        </div>

        {/* 確認ダイアログ */}
        <ConfirmationDialog
          isOpen={isConfirmationOpen}
          onOpenChange={setIsConfirmationOpen}
          isCurrentImage={isCurrentImageSelected}
          onConfirm={handleConfirmSelection}
          isUpdating={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
}
