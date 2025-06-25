import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Flashcard, Meaning } from "@/types";
import { MediaCreateResult } from "@/types/ui";
import { MeaningAddPopover } from "./MeaningAddPopover";
import {
  CheckMark,
  WordHeader,
  MediaDisplay,
  MeaningList,
  ExampleSection,
  ExplanationSection,
} from "./shared";
import { MeaningDeletePopover } from "./MeaningDeletePopover";

interface FlashcardItemProps {
  flashcard: Flashcard;
  selectedMeaning: Meaning;
  mediaCreateResult?: MediaCreateResult;
  onCheckFlagToggle: (flashcardId: string) => void;
  onMeaningSelect: (flashcardId: string, meaningId: string) => void;
  onMeaningAdded: (flashcardId: string, newMeanings: Meaning[]) => void;
  onMeaningDeleted: (flashcardId: string, deletedMeanings: Meaning[]) => void;
  onMediaClick: (flashcard: Flashcard) => void;
  onMemoEdit: (flashcard: Flashcard) => void;
  // 表示制御のオプション
  showCheckbox?: boolean;
  showWordHeader?: boolean;
  showMedia?: boolean;
  showMeanings?: boolean;
  showExamples?: boolean;
  showExplanation?: boolean;
  showMeaningActions?: boolean; // 意味追加・削除ボタン
  showMemo?: boolean;
  // 機能制御のオプション
  enableMediaClick?: boolean; // 画像クリック機能
  enableCheckToggle?: boolean; // チェックマーク機能
  enableMeaningSelect?: boolean; // 意味選択機能（例文変更）
  enableMemoEdit?: boolean; // メモ編集機能
  // スタイル制御のオプション
  borderColor?: string; // ボーダー色（指定された場合border-4が適用される）
}

export function FlashcardItem({
  flashcard,
  selectedMeaning,
  mediaCreateResult,
  onCheckFlagToggle,
  onMeaningSelect,
  onMeaningAdded,
  onMeaningDeleted,
  onMediaClick,
  onMemoEdit,
  // デフォルトですべて表示
  showCheckbox = true,
  showWordHeader = true,
  showMedia = true,
  showMeanings = true,
  showExamples = true,
  showExplanation = true,
  showMeaningActions = true,
  showMemo = true,
  // デフォルトですべての機能を有効
  enableMediaClick = true,
  enableCheckToggle = true,
  enableMeaningSelect = true,
  enableMemoEdit = true,
  // スタイル制御のオプション
  borderColor,
}: FlashcardItemProps) {
  return (
    <Card
      className={`bg-primary w-full max-w-5xl shadow-sm ${borderColor ? `border-4 ${borderColor}` : "border-0"}`}
    >
      <CardContent className="px-6">
        <div className="flex gap-6">
          {/* 左側：チェックボックス + 単語情報 + 画像 (固定幅) */}
          <div className="w-48 flex-shrink-0 space-y-4">
            <div className="flex items-start gap-3">
              {showCheckbox && (
                <CheckMark
                  isChecked={flashcard.checkFlag}
                  onClick={() => onCheckFlagToggle(flashcard.flashcardId)}
                  isInteractive={enableCheckToggle}
                />
              )}
              {showWordHeader && (
                <WordHeader
                  word={flashcard.word.word}
                  pronunciation={selectedMeaning?.pronunciation}
                />
              )}
            </div>

            {showMedia && (
              <MediaDisplay
                mediaUrls={flashcard.media?.mediaUrls}
                word={flashcard.word.word}
                translation={selectedMeaning?.translation}
                onClick={() => onMediaClick(flashcard)}
                isInteractive={enableMediaClick}
                status={mediaCreateResult?.status}
                error={mediaCreateResult?.error}
              />
            )}
          </div>

          {/* 中央：意味・例文・説明 (可変幅) */}
          <div className="flex-1 space-y-4">
            {/* 意味セクション - 3列表示 */}
            {showMeanings && (
              <div className="space-y-4">
                <MeaningList
                  meanings={flashcard.meanings}
                  selectedMeaningId={selectedMeaning.meaningId}
                  onMeaningSelect={
                    enableMeaningSelect
                      ? (meaningId) =>
                          onMeaningSelect(flashcard.flashcardId, meaningId)
                      : () => {}
                  }
                />
              </div>
            )}

            {/* 例文セクション */}
            {showExamples && (
              <ExampleSection
                exampleEng={selectedMeaning?.exampleEng}
                exampleJpn={selectedMeaning?.exampleJpn}
              />
            )}

            {showExplanation && (
              <ExplanationSection
                explanation={flashcard.word.explanation}
                showEditButton={false}
              />
            )}
          </div>

          {/* 右側：ボタン類 (固定幅) */}
          {(showMeaningActions || showMemo) && (
            <div className="flex w-16 flex-shrink-0 flex-col items-center justify-between pb-4">
              {showMeaningActions && (
                <div className="flex">
                  <MeaningAddPopover
                    flashcardId={flashcard.flashcardId}
                    wordId={flashcard.word.wordId}
                    currentMeanings={flashcard.meanings}
                    onMeaningAdded={(newMeanings) =>
                      onMeaningAdded(flashcard.flashcardId, newMeanings)
                    }
                  />
                  <MeaningDeletePopover
                    flashcardId={flashcard.flashcardId}
                    currentMeanings={flashcard.meanings}
                    onMeaningDeleted={(deletedMeanings) =>
                      onMeaningDeleted(flashcard.flashcardId, deletedMeanings)
                    }
                  />
                </div>
              )}

              {showMemo && (
                <Image
                  src={
                    flashcard.word.explanation &&
                    flashcard.word.explanation.trim() !== ""
                      ? "/note_noted.svg"
                      : "/note_new.svg"
                  }
                  alt="編集"
                  width={36}
                  height={36}
                  onClick={
                    enableMemoEdit ? () => onMemoEdit(flashcard) : undefined
                  }
                  className={
                    enableMemoEdit
                      ? "cursor-pointer transition-opacity hover:opacity-80"
                      : "cursor-not-allowed opacity-50"
                  }
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
