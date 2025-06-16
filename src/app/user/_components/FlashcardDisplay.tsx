// 画像比較のためのコンポーネント
import React from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flashcard, Meaning } from "@/types";
import { posTranslations } from "@/constants";

interface FlashcardDisplayProps {
  flashcard: Flashcard;
  selectedMeaning: Meaning;
  onMeaningSelect: (meaningId: string) => void;
}

export function FlashcardDisplay({
  flashcard,
  selectedMeaning,
  onMeaningSelect,
}: FlashcardDisplayProps) {
  return (
    <Card className="mb-6 border-0 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-main border-main mt-1 flex h-6 w-6 items-center justify-center rounded border-2">
                <Check className="h-4 w-4 text-white" />
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

            <div className="bg-secondary rounded-lg p-8 text-center">
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
                      onClick={() => onMeaningSelect(meaning.meaningId)}
                    >
                      <Badge className="bg-sub text-custom flex-shrink-0 border-0 px-2 py-1 text-sm">
                        {posTranslations[meaning.pos] || meaning.pos}
                      </Badge>
                      <span className="text-custom text-base font-medium">
                        {meaning.translation}
                      </span>
                    </div>
                  );
                })}

                <div className="flex items-center gap-2 p-2">
                  <Badge className="bg-secondary text-custom flex-shrink-0 border-0 px-2 py-1 text-sm">
                    他
                  </Badge>
                  <span className="text-custom text-sm">をみなす</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-main hover:text-main hover:bg-sub/20 h-auto p-0 font-normal"
              >
                <Plus className="mr-1 h-4 w-4" />
                意味を追加する
              </Button>
            </div>

            {/* 例文セクション */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <p className="text-custom text-base leading-relaxed">
                {selectedMeaning?.exampleEng}
              </p>
              <p className="text-custom text-sm leading-relaxed">
                {selectedMeaning?.exampleJpn}
              </p>
            </div>

            <div className="text-custom bg-secondary rounded p-3 text-sm">
              <p>{flashcard.word.explanation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
