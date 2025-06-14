import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Meaning } from "@/types/type";
import { mockFlashcardService } from "@/services/mockService";

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

interface AddMeaningPopoverProps {
  flashcardId: string;
  wordId: string;
  currentMeanings: Meaning[];
  onMeaningAdded: (meanings: Meaning[]) => void;
}

export function AddMeaningPopover({
  flashcardId,
  wordId,
  currentMeanings,
  onMeaningAdded,
}: AddMeaningPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableMeanings, setAvailableMeanings] = useState<Meaning[]>([]);
  const [selectedMeanings, setSelectedMeanings] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState("");

  // 現在のフラッシュカードにない意味のみを取得
  const getAvailableMeanings = (allMeanings: Meaning[]): Meaning[] => {
    const currentMeaningIds = new Set(currentMeanings.map((m) => m.meaningId));
    return allMeanings.filter(
      (meaning) => !currentMeaningIds.has(meaning.meaningId)
    );
  };

  // Popoverが開かれた時に意味を取得
  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    if (open && availableMeanings.length === 0) {
      setIsLoading(true);
      setError("");

      try {
        const allMeanings = await mockFlashcardService.getMeanings(wordId);
        const available = getAvailableMeanings(allMeanings);
        setAvailableMeanings(available);
      } catch (err) {
        setError("意味の取得に失敗しました");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 意味の選択/選択解除
  const toggleMeaningSelection = (meaningId: string) => {
    const newSelected = new Set(selectedMeanings);
    if (newSelected.has(meaningId)) {
      newSelected.delete(meaningId);
    } else {
      newSelected.add(meaningId);
    }
    setSelectedMeanings(newSelected);
  };

  // 選択した意味をフラッシュカードに追加
  const handleAddMeanings = async () => {
    if (selectedMeanings.size === 0) return;

    setIsLoading(true);
    setError("");

    try {
      const meaningsToAdd = availableMeanings.filter((meaning) =>
        selectedMeanings.has(meaning.meaningId)
      );

      await mockFlashcardService.addMeaning({
        flashcardId,
        meaning: meaningsToAdd,
      });

      // 成功時の処理
      onMeaningAdded(meaningsToAdd);
      setSelectedMeanings(new Set());
      setIsOpen(false);

      // 利用可能な意味リストから追加した意味を削除
      setAvailableMeanings((prev) =>
        prev.filter((meaning) => !selectedMeanings.has(meaning.meaningId))
      );
    } catch (err) {
      setError("意味の追加に失敗しました");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-main hover:text-main hover:bg-sub/20 p-0 h-auto font-normal"
        >
          <Plus className="w-4 h-4 mr-1" />
          意味を追加する
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="font-medium text-custom">追加可能な意味</div>

          {isLoading && (
            <div className="text-center py-4 text-gray-500">読み込み中...</div>
          )}

          {error && <div className="text-red-600 text-sm">{error}</div>}

          {!isLoading && !error && availableMeanings.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              追加可能な意味がありません
            </div>
          )}

          {!isLoading && !error && availableMeanings.length > 0 && (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableMeanings.map((meaning) => {
                  const isSelected = selectedMeanings.has(meaning.meaningId);
                  return (
                    <div
                      key={meaning.meaningId}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "border-main bg-sub/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleMeaningSelection(meaning.meaningId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-sub text-custom border-0 text-xs px-2 py-1">
                            {posTranslations[meaning.pos] || meaning.pos}
                          </Badge>
                          <span className="text-custom font-medium text-sm">
                            {meaning.translation}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-main" />}
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-600">
                          {meaning.exampleEng}
                        </p>
                        <p className="text-xs text-gray-600">
                          {meaning.exampleJpn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-500">
                  {selectedMeanings.size}個選択中
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="border-gray-200"
                  >
                    キャンセル
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddMeanings}
                    disabled={selectedMeanings.size === 0 || isLoading}
                    className="bg-main hover:bg-main/90 text-white"
                  >
                    {isLoading ? "追加中..." : `${selectedMeanings.size}個追加`}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
