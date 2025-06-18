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
import { posTranslations, API_ENDPOINTS } from "@/constants";
import { httpClient, ErrorHandler } from "@/lib";

interface MeaningUpdatePopoverProps {
  flashcardId: string;
  wordId: string;
  currentMeanings: Meaning[];
  onMeaningAdded: (meanings: Meaning[]) => void;
}

export function MeaningUpdatePopover({
  flashcardId,
  wordId,
  currentMeanings,
  onMeaningAdded,
}: MeaningUpdatePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableMeanings, setAvailableMeanings] = useState<Meaning[]>([]);
  const [selectedMeanings, setSelectedMeanings] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState("");

  const getAvailableMeanings = (allMeanings: Meaning[]): Meaning[] => {
    const currentMeaningIds = new Set(currentMeanings.map((m) => m.meaningId));
    return allMeanings.filter(
      (meaning) => !currentMeaningIds.has(meaning.meaningId)
    );
  };

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    if (open && availableMeanings.length === 0) {
      setIsLoading(true);
      setError("");

      const response = await httpClient.get<{ meanings: Meaning[] }>(
        API_ENDPOINTS.MEANING.GET(wordId)
      );

      if (response.success) {
        const allMeanings = response.data.meanings || [];
        const available = getAvailableMeanings(allMeanings);
        setAvailableMeanings(available);
      } else {
        const errorMessage = ErrorHandler.getUserFriendlyMessage(
          response.error
        );
        setError(errorMessage);
        ErrorHandler.logError(response.error);
      }

      setIsLoading(false);
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

  const handleAddMeanings = async () => {
    if (selectedMeanings.size === 0) return;

    setIsLoading(true);
    setError("");

    try {
      const meaningsToAdd = availableMeanings.filter((meaning) =>
        selectedMeanings.has(meaning.meaningId)
      );

      // 既存の意味IDリストを取得
      const existingMeaningIds = currentMeanings.map((m) => m.meaningId);
      // 新しく追加する意味IDリストを取得
      const newMeaningIds = meaningsToAdd.map((meaning) => meaning.meaningId);
      // 既存 + 新規をマージして重複除去
      const allMeaningIds = [
        ...new Set([...existingMeaningIds, ...newMeaningIds]),
      ];

      const response = await httpClient.put<void>(
        API_ENDPOINTS.FLASHCARD.UPDATE_MEANINGS,
        {
          flashcardId,
          usingMeaningIdList: allMeaningIds, // 全ての意味ID（既存 + 新規）
        }
      );

      if (!response.success) {
        const errorMessage = ErrorHandler.getUserFriendlyMessage(
          response.error
        );
        setError(errorMessage);
        ErrorHandler.logError(response.error);
        setIsLoading(false);
        return;
      }

      onMeaningAdded(meaningsToAdd);
      setSelectedMeanings(new Set());
      setIsOpen(false);

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
        <div className="group relative">
          <Button
            variant="ghost"
            size="lg"
            className="text-main hover:text-main hover:bg-sub/20 font-normal"
          >
            <CirclePlus className="size-6" />
          </Button>

          {/* ツールチップ */}
          <div className="bg-main pointer-events-none absolute top-[-32px] left-1/2 -translate-x-1/2 transform rounded px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            意味を追加する
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="text-custom font-medium">追加可能な意味</div>

          {isLoading && (
            <div className="py-4 text-center text-gray-500">読み込み中...</div>
          )}

          {error && <div className="text-sm text-red-600">{error}</div>}

          {!isLoading && !error && availableMeanings.length === 0 && (
            <div className="py-4 text-center text-gray-500">
              追加可能な意味がありません
            </div>
          )}

          {!isLoading && !error && availableMeanings.length > 0 && (
            <>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {availableMeanings.map((meaning) => {
                  const isSelected = selectedMeanings.has(meaning.meaningId);
                  return (
                    <div
                      key={meaning.meaningId}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                        isSelected
                          ? "border-main bg-sub/20"
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
                        {isSelected && <Check className="text-main h-4 w-4" />}
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
