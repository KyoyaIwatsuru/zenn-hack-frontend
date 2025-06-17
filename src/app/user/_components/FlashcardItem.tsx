// 単語帳一覧での単語カードコンポーネント
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  onCompareClick: (flashcard: Flashcard) => void;
}

export function FlashcardItem({
  flashcard,
  selectedMeaning,
  onCheckFlagToggle,
  onMeaningSelect,
  onMeaningAdded,
  onMediaClick,
  onMemoEdit,
  onCompareClick,
}: FlashcardItemProps) {
  return (
    <Card className="bg-primary border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 左側：チェックボックス + 単語情報 + 画像 */}
          <div className="col-span-3 space-y-4">
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

              <MeaningUpdatePopover
                flashcardId={flashcard.flashcardId}
                wordId={flashcard.word.wordId}
                currentMeanings={flashcard.meanings}
                onMeaningAdded={(newMeanings) =>
                  onMeaningAdded(flashcard.flashcardId, newMeanings)
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
              showEditButton={true}
              onEdit={() => onMemoEdit(flashcard)}
            />

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCompareClick(flashcard)}
                className="text-custom border-gray-200 hover:bg-gray-50"
              >
                画像比較
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
