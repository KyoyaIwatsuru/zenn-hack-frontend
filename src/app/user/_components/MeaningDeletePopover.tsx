import React, { useState } from "react";
import { Check, CircleMinus } from "lucide-react";
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

interface MeaningDeletePopoverProps {
  flashcardId: string;
  currentMeanings: Meaning[];
  onMeaningDeleted: (deletedMeanings: Meaning[]) => void;
}

export function MeaningDeletePopover({
  flashcardId,
  currentMeanings,
  onMeaningDeleted,
}: MeaningDeletePopoverProps) {
  const { isLoadingMeanings, deleteMeanings } = useFlashcards();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMeanings, setSelectedMeanings] = useState<Set<string>>(
    new Set()
  );

  const toggleMeaningSelection = (meaningId: string) => {
    const newSelected = new Set(selectedMeanings);
    if (newSelected.has(meaningId)) {
      newSelected.delete(meaningId);
    } else {
      newSelected.add(meaningId);
    }
    setSelectedMeanings(newSelected);
  };

  const handleDeleteMeanings = async () => {
    if (selectedMeanings.size === 0) return;

    try {
      const meaningsToDelete = currentMeanings.filter((meaning) =>
        selectedMeanings.has(meaning.meaningId)
      );

      await deleteMeanings(flashcardId, meaningsToDelete);

      onMeaningDeleted(meaningsToDelete);
      setSelectedMeanings(new Set());
      setIsOpen(false);
    } catch (err) {
      console.error("意味の削除に失敗しました:", err);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="group relative">
          <Button
            variant="ghost"
            size="lg"
            className="text-blue hover:text-blue !px-2 font-normal hover:bg-blue-50"
          >
            <CircleMinus className="size-6" />
          </Button>

          {/* ツールチップ */}
          <div className="bg-blue pointer-events-none absolute top-[-32px] left-1/2 -translate-x-1/2 transform rounded px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            意味を削除する
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="text-custom font-medium">削除する意味を選択</div>

          {currentMeanings.length === 0 && (
            <div className="py-4 text-center text-gray-500">
              削除可能な意味がありません
            </div>
          )}

          {currentMeanings.length > 0 && (
            <>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {currentMeanings.map((meaning) => {
                  const isSelected = selectedMeanings.has(meaning.meaningId);
                  return (
                    <div
                      key={meaning.meaningId}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                        isSelected
                          ? "border-blue bg-blue-sub"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleMeaningSelection(meaning.meaningId)}
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
                        {isSelected && <Check className="text-blue h-4 w-4" />}
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
                    onClick={handleDeleteMeanings}
                    disabled={selectedMeanings.size === 0 || isLoadingMeanings}
                    className="bg-blue hover-blue text-white"
                  >
                    {isLoadingMeanings
                      ? "削除中..."
                      : `${selectedMeanings.size}個削除`}
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
