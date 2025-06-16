import React from "react";
import Image from "next/image";
import { Edit3, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flashcard, Meaning } from "@/types";
import { posTranslations } from "@/constants";
import { MeaningUpdatePopover } from "./MeaningUpdatePopover";

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
    <Card className="border-0 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 左側：チェックボックス + 単語情報 + 画像 */}
          <div className="col-span-6 space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded border-2 transition-colors ${
                  flashcard.checkFlag
                    ? "bg-main border-main"
                    : "border-main hover:bg-main/10 bg-transparent"
                }`}
                onClick={() => onCheckFlagToggle(flashcard.flashcardId)}
              >
                {flashcard.checkFlag && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-custom mb-1 text-2xl font-bold">
                  {flashcard.word.word}
                </h2>
                <p className="text-custom text-sm">
                  [{selectedMeaning?.pronunciation || ""}]
                </p>
              </div>
            </div>

            <div
              className="bg-secondary hover:bg-secondary/80 cursor-pointer rounded-lg p-8 text-center transition-colors"
              onClick={() => onMediaClick(flashcard)}
            >
              <div className="relative mx-auto mb-2 h-32 w-32 overflow-hidden rounded-lg">
                {flashcard.media?.mediaUrls?.[0] ? (
                  <Image
                    src={flashcard.media.mediaUrls[0]}
                    alt={`${flashcard.word.word} - ${selectedMeaning?.translation}`}
                    fill
                    className="rounded-lg object-cover"
                    onError={() => {
                      console.error(
                        "Failed to load image:",
                        flashcard.media.mediaUrls[0]
                      );
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-300">
                    <div className="text-xs text-gray-500">画像</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-6 space-y-4">
            {/* 意味セクション - 2列表示 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {flashcard.meanings.map((meaning) => {
                  const isSelected =
                    selectedMeaning.meaningId === meaning.meaningId;
                  return (
                    <div
                      key={meaning.meaningId}
                      className={`flex cursor-pointer items-center gap-2 rounded p-2 transition-colors ${
                        isSelected ? "bg-sub/30" : "hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        onMeaningSelect(
                          flashcard.flashcardId,
                          meaning.meaningId
                        )
                      }
                    >
                      <Badge className="bg-sub text-custom flex-shrink-0 border-0 px-2 py-1 text-sm">
                        {posTranslations[meaning.pos] || meaning.pos}
                      </Badge>
                      <span className="text-custom text-sm font-medium">
                        {meaning.translation}
                      </span>
                    </div>
                  );
                })}
              </div>

              <MeaningUpdatePopover
                flashcardId={flashcard.flashcardId}
                wordId={flashcard.word.wordId}
                currentMeanings={flashcard.meanings}
                onMeaningAdded={(newMeanings) =>
                  onMeaningAdded(flashcard.flashcardId, newMeanings)
                }
              />
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4">
              <p className="text-custom text-sm leading-relaxed">
                {selectedMeaning?.exampleEng}
              </p>
              <p className="text-custom text-sm leading-relaxed">
                {selectedMeaning?.exampleJpn}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-custom bg-secondary flex-1 rounded p-3 text-sm">
                <p>{flashcard.word.explanation}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMemoEdit(flashcard)}
                className="text-custom hover:text-custom flex-shrink-0 p-2 hover:bg-gray-100"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>

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
