import React, { useState } from "react";
import { Check, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Meaning } from "@/types";
import { posTranslations } from "@/constants";
import { useFlashcards } from "@/hooks";

interface MeaningAddPopoverProps {
  flashcardId: string;
  wordId: string;
  currentMeanings: Meaning[];
  onMeaningAdded: (meanings: Meaning[]) => void;
}

export function MeaningAddPopover({
  flashcardId,
  wordId,
  currentMeanings,
  onMeaningAdded,
}: MeaningAddPopoverProps) {
  const {
    isLoadingMeanings,
    meaningsError,
    availableMeanings,
    getMeanings,
    addMeanings,
  } = useFlashcards();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMeanings, setSelectedMeanings] = useState<Set<string>>(
    new Set()
  );

  const getAvailableMeanings = (allMeanings: Meaning[]): Meaning[] => {
    const currentMeaningIds = new Set(currentMeanings.map((m) => m.meaningId));
    return allMeanings.filter(
      (meaning) => !currentMeaningIds.has(meaning.meaningId)
    );
  };

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    if (open && !availableMeanings[wordId]) {
      try {
        await getMeanings(wordId);
      } catch (error) {
        console.error("Failed to load meanings:", error);
      }
    }
  };

  const toggleMeaningSelection = (meaningId: string) => {
    const newSelected = new Set(selectedMeanings);
    if (newSelected.has(meaningId)) {
      newSelected.delete(meaningId);
    } else {
      newSelected.add(meaningId);
    }
    setSelectedMeanings(newSelected);
  };

  const handleUpdateMeanings = async () => {
    if (selectedMeanings.size === 0) return;

    try {
      const allMeanings = availableMeanings[wordId] || [];
      const available = getAvailableMeanings(allMeanings);
      const meaningsToAdd = available.filter((meaning) =>
        selectedMeanings.has(meaning.meaningId)
      );

      await addMeanings(flashcardId, meaningsToAdd);

      onMeaningAdded(meaningsToAdd);
      setSelectedMeanings(new Set());
      setIsOpen(false);
    } catch (err) {
      console.error("意味の追加に失敗しました:", err);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="group relative">
          <Button
            variant="ghost"
            size="lg"
            className="text-red hover:text-red !px-2 font-normal hover:bg-red-50"
          >
            <CirclePlus className="size-6" />
          </Button>

          {/* ツールチップ */}
          <div className="bg-red pointer-events-none absolute top-[-32px] left-1/2 -translate-x-1/2 transform rounded px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            意味を追加する
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="text-custom font-medium">追加可能な意味</div>

          {isLoadingMeanings && (
            <div className="py-4 text-center text-gray-500">読み込み中...</div>
          )}

          {meaningsError && (
            <div className="text-sm text-red-600">{meaningsError}</div>
          )}

          {!isLoadingMeanings &&
            !meaningsError &&
            getAvailableMeanings(availableMeanings[wordId] || []).length ===
              0 && (
              <div className="py-4 text-center text-gray-500">
                追加可能な意味がありません
              </div>
            )}

          {!isLoadingMeanings &&
            !meaningsError &&
            getAvailableMeanings(availableMeanings[wordId] || []).length >
              0 && (
              <>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {getAvailableMeanings(availableMeanings[wordId] || []).map(
                    (meaning) => {
                      const isSelected = selectedMeanings.has(
                        meaning.meaningId
                      );
                      return (
                        <div
                          key={meaning.meaningId}
                          className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                            isSelected
                              ? "border-main bg-sub/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            toggleMeaningSelection(meaning.meaningId)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-sub text-custom border-0 px-2 py-1 text-xs">
                                {posTranslations[meaning.pos] || meaning.pos}
                              </Badge>
                              <span className="text-custom text-sm font-medium">
                                {meaning.translation}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="text-main h-4 w-4" />
                            )}
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
                    }
                  )}
                </div>

                <div className="flex items-center justify-between border-t pt-2">
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
                      onClick={handleUpdateMeanings}
                      disabled={
                        selectedMeanings.size === 0 || isLoadingMeanings
                      }
                      className="bg-main hover:bg-main/90 text-white"
                    >
                      {isLoadingMeanings
                        ? "追加中..."
                        : `${selectedMeanings.size}個追加`}
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
