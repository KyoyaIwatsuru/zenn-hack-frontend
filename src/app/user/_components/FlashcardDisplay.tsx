import React from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flashcard, Meaning } from "@/types/type";

const posTranslations: Record<string, string> = {
  noun: "名",
  pronoun: "代",
  intransitiveVerb: "自動",
  transitiveVerb: "他動",
  adjective: "形",
  adverb: "副",
  auxiliaryVerb: "助動",
  preposition: "前",
  article: "冠",
  interjection: "感",
  conjunction: "接",
  idiom: "熟語",
};

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
    <Card className="bg-white shadow-sm border-0 mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 左側：チェックボックス + 単語情報 + 画像 */}
          <div className="col-span-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded border-2 flex items-center justify-center mt-1 bg-main border-main">
                <Check className="w-4 h-4 text-white" />
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

            {/* 画像セクション */}
            <div className="bg-secondary rounded-lg p-8 text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <div className="text-gray-500 text-xs">画像</div>
              </div>
            </div>
          </div>

          {/* 右側：意味 + 例文 + 説明 */}
          <div className="col-span-6 space-y-4">
            {/* 意味セクション - 2列表示 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {flashcard.meaning.map((meaning) => {
                  const isSelected =
                    selectedMeaning.meaningId === meaning.meaningId;
                  return (
                    <div
                      key={meaning.meaningId}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded transition-colors ${
                        isSelected ? "bg-sub/30" : "hover:bg-gray-50"
                      }`}
                      onClick={() => onMeaningSelect(meaning.meaningId)}
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

                <div className="flex items-center gap-2 p-2">
                  <Badge className="bg-secondary text-custom border-0 text-sm px-2 py-1 flex-shrink-0">
                    他
                  </Badge>
                  <span className="text-custom text-sm">をみなす</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-main hover:text-main hover:bg-sub/20 p-0 h-auto font-normal"
              >
                <Plus className="w-4 h-4 mr-1" />
                意味を追加する
              </Button>
            </div>

            {/* 例文セクション */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <p className="text-custom text-sm leading-relaxed">
                {selectedMeaning?.exampleEng}
              </p>
              <p className="text-custom text-sm leading-relaxed">
                {selectedMeaning?.exampleJpn}
              </p>
            </div>

            {/* 説明テキスト */}
            <div className="text-sm text-custom bg-secondary p-3 rounded">
              <p>{flashcard.word.explanation}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
