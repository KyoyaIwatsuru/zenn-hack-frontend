// 画像比較画面や生成画面での単語カード
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flashcard, Meaning } from "@/types";
import {
  CheckMark,
  WordHeader,
  MediaDisplay,
  MeaningList,
  ExampleSection,
  ExplanationSection,
} from "./shared";

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
    <Card className="bg-primary mb-6 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-4">
            <div className="flex items-start gap-3">
              <CheckMark isChecked={true} />
              <WordHeader
                word={flashcard.word.word}
                pronunciation={selectedMeaning?.pronunciation}
              />
            </div>

            <MediaDisplay
              mediaUrls={flashcard.media?.mediaUrls}
              word={flashcard.word.word}
              translation={selectedMeaning?.translation}
            />
          </div>

          <div className="col-span-9 space-y-4">
            {/* 意味セクション - 3列表示 */}
            <div className="space-y-4">
              <MeaningList
                meanings={flashcard.meanings}
                selectedMeaningId={selectedMeaning.meaningId}
                onMeaningSelect={onMeaningSelect}
              />

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
            <ExampleSection
              exampleEng={selectedMeaning?.exampleEng}
              exampleJpn={selectedMeaning?.exampleJpn}
            />

            <ExplanationSection explanation={flashcard.word.explanation} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
