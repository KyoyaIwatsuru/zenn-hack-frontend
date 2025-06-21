// 生成済み単語一覧での単語カードコンポーネント（画像比較用）
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Flashcard, Meaning } from "@/types";
import { MeaningUpdatePopover } from "./MeaningUpdatePopover";
import {
  CheckMark,
  WordHeader,
  MediaDisplay,
  MeaningList,
  ExampleSection,
  ExplanationSection,
} from "./shared";

interface GeneratedFlashcardItemProps {
  flashcard: Flashcard;
  selectedMeaning: Meaning;
  onCheckFlagToggle: (flashcardId: string) => void;
  onMeaningSelect: (flashcardId: string, meaningId: string) => void;
  onMeaningAdded: (flashcardId: string, newMeanings: Meaning[]) => void;
  onMediaClick: (flashcard: Flashcard) => void;
  onMemoEdit: (flashcard: Flashcard) => void;
}

export function GeneratedFlashcardItem({
  flashcard,
  selectedMeaning,
  onCheckFlagToggle,
  onMeaningSelect,
  onMeaningAdded,
  onMediaClick,
  onMemoEdit,
}: GeneratedFlashcardItemProps) {
  return (
    <Card className="bg-primary w-full max-w-5xl border-0 shadow-sm">
      <CardContent className="px-6">
        <div className="flex gap-6">
          {/* 左側：チェックボックス + 単語情報 + 画像 (固定幅) */}
          <div className="w-48 flex-shrink-0 space-y-4">
            <div className="flex items-start gap-3">
              <CheckMark
                isChecked={flashcard.checkFlag}
                onClick={() => onCheckFlagToggle(flashcard.flashcardId)}
                isInteractive={true}
              />
              <div className="space-y-2">
                <WordHeader
                  word={flashcard.word.word}
                  pronunciation={selectedMeaning?.pronunciation}
                />
                <Badge variant="secondary" className="text-xs">
                  比較待ち
                </Badge>
              </div>
            </div>

            <MediaDisplay
              mediaUrls={flashcard.media?.mediaUrls}
              word={flashcard.word.word}
              translation={selectedMeaning?.translation}
              onClick={() => onMediaClick(flashcard)}
              isInteractive={true}
            />
          </div>

          {/* 中央：意味・例文・説明 (可変幅) */}
          <div className="flex-1 space-y-4">
            {/* 意味セクション - 3列表示 */}
            <div className="space-y-4">
              <MeaningList
                meanings={flashcard.meanings}
                selectedMeaningId={selectedMeaning.meaningId}
                onMeaningSelect={(meaningId) =>
                  onMeaningSelect(flashcard.flashcardId, meaningId)
                }
              />
            </div>

            {/* 例文セクション */}
            <ExampleSection
              exampleEng={selectedMeaning?.exampleEng}
              exampleJpn={selectedMeaning?.exampleJpn}
            />

            <ExplanationSection
              explanation={flashcard.word.explanation}
              showEditButton={false}
            />
          </div>

          {/* 右側：ボタン類 (固定幅) */}
          <div className="flex w-16 flex-shrink-0 flex-col items-center justify-between pb-4">
            <MeaningUpdatePopover
              flashcardId={flashcard.flashcardId}
              wordId={flashcard.word.wordId}
              currentMeanings={flashcard.meanings}
              onMeaningAdded={(newMeanings) =>
                onMeaningAdded(flashcard.flashcardId, newMeanings)
              }
            />

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
              onClick={() => onMemoEdit(flashcard)}
              className="cursor-pointer transition-opacity hover:opacity-80"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
