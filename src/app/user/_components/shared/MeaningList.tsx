import React from "react";
import { Badge } from "@/components/ui/badge";
import { Meaning } from "@/types";
import { posTranslations } from "@/constants";

interface MeaningListProps {
  meanings: Meaning[];
  selectedMeaningId: string | null;
  onMeaningSelect: (meaningId: string) => void;
  flashcardMediaMeaningId?: string | null;
}

export function MeaningList({
  meanings,
  selectedMeaningId,
  onMeaningSelect,
  flashcardMediaMeaningId,
}: MeaningListProps) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
      {meanings.map((meaning) => {
        const isSelected = selectedMeaningId === meaning.meaningId;
        const isMediaMeaning = flashcardMediaMeaningId === meaning.meaningId;

        let itemClasses =
          "flex cursor-pointer items-center gap-2 rounded p-2 transition-colors";
        let textClasses = "text-custom text-sm font-medium";

        if (isMediaMeaning) {
          itemClasses += " bg-whole border border-main";
          textClasses += " font-semibold";
        } else if (isSelected) {
          itemClasses += " bg-gray-200 shadow-inner";
          textClasses += " font-bold";
        } else {
          itemClasses += " hover:bg-gray-50";
        }

        return (
          <div
            key={meaning.meaningId}
            className={itemClasses}
            onClick={() => onMeaningSelect(meaning.meaningId)}
          >
            <Badge className="bg-sub text-custom flex-shrink-0 border-0 px-2 py-1 text-sm">
              {posTranslations[meaning.pos] || meaning.pos}
            </Badge>
            <span className={textClasses}>{meaning.translation}</span>
          </div>
        );
      })}
    </div>
  );
}
