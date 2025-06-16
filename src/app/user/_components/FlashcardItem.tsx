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
    <Card className="bg-white shadow-sm border-0">
      <CardContent className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 左側：チェックボックス + 単語情報 + 画像 */}
          <div className="col-span-6 space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-colors mt-1 ${
                  flashcard.checkFlag
                    ? "bg-main border-main"
                    : "border-main bg-transparent hover:bg-main/10"
                }`}
                onClick={() => onCheckFlagToggle(flashcard.flashcardId)}
              >
                {flashcard.checkFlag && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-custom mb-1">
                  {flashcard.word.word}
                </h2>
                <p className="text-custom text-sm">
                  [{selectedMeaning?.pronunciation || ""}]
                </p>
              </div>
            </div>

            <div
              className="bg-secondary rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => onMediaClick(flashcard)}
            >
              <div className="w-32 h-32 rounded-lg mx-auto mb-2 overflow-hidden relative">
                {flashcard.media?.mediaUrls?.[0] ? (
                  <Image
                    src={flashcard.media.mediaUrls[0]}
                    alt={`${flashcard.word.word} - ${selectedMeaning?.translation}`}
                    fill
                    className="object-cover rounded-lg"
                    onError={() => {
                      console.error("Failed to load image:", flashcard.media.mediaUrls[0]);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500 text-xs">画像</div>
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
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded transition-colors ${
                        isSelected ? "bg-sub/30" : "hover:bg-gray-50"
                      }`}
                      onClick={() =>
                        onMeaningSelect(flashcard.flashcardId, meaning.meaningId)
                      }
                    >
                      <Badge className="bg-sub text-custom border-0 text-sm px-2 py-1 flex-shrink-0">
                        {posTranslations[meaning.pos] || meaning.pos}
                      </Badge>
                      <span className="text-custom font-medium text-sm">
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

            <div className="space-y-2 pt-4 border-t border-gray-100">
              <p className="text-custom text-sm leading-relaxed">
                {selectedMeaning?.exampleEng}
              </p>
              <p className="text-custom text-sm leading-relaxed">
                {selectedMeaning?.exampleJpn}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-sm text-custom bg-secondary p-3 rounded flex-1">
                <p>{flashcard.word.explanation}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMemoEdit(flashcard)}
                className="text-custom hover:text-custom hover:bg-gray-100 p-2 flex-shrink-0"
              >
                <Edit3 className="w-4 h-4" />
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