// 単語帳一覧での単語カードコンポーネント
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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

interface FlashcardItemProps {
  flashcard: Flashcard;
  selectedMeaning: Meaning;
  onCheckFlagToggle: (flashcardId: string) => void;
  onMeaningSelect: (flashcardId: string, meaningId: string) => void;
  onMeaningAdded: (flashcardId: string, newMeanings: Meaning[]) => void;
  onMediaClick: (flashcard: Flashcard) => void;
  onMemoEdit: (flashcard: Flashcard) => void;
}

export function FlashcardItem({
  flashcard,
  selectedMeaning,
  onCheckFlagToggle,
  onMeaningSelect,
  onMeaningAdded,
  onMediaClick,
  onMemoEdit,
}: FlashcardItemProps) {
  return (
    <Card className="bg-primary max-w-[75vw] border-0 shadow-sm">
      <CardContent className="px-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 左側：チェックボックス + 単語情報 + 画像 (col-span-2) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-start gap-3">
              <CheckMark
                isChecked={flashcard.checkFlag}
                onClick={() => onCheckFlagToggle(flashcard.flashcardId)}
                isInteractive={true}
              />
              <WordHeader
                word={flashcard.word.word}
                pronunciation={selectedMeaning?.pronunciation}
              />
            </div>

            <MediaDisplay
              mediaUrls={flashcard.media?.mediaUrls}
              word={flashcard.word.word}
              translation={selectedMeaning?.translation}
              onClick={() => onMediaClick(flashcard)}
              isInteractive={true}
            />
          </div>

          {/* 中央：意味・例文・説明 (col-span-9) */}
          <div className="col-span-9 space-y-4">
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

          {/* 右側：ボタン類 (col-span-1) */}
          <div className="col-span-1 flex flex-col items-center space-y-4">
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
