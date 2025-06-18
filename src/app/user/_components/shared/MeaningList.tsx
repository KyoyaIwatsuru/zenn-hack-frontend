import React from "react";
import { Badge } from "@/components/ui/badge";
import { Meaning } from "@/types";
import { posTranslations } from "@/constants";

interface MeaningListProps {
  meanings: Meaning[];
  selectedMeaningId: string;
  onMeaningSelect: (meaningId: string) => void;
}

export function MeaningList({
  meanings,
  selectedMeaningId,
  onMeaningSelect,
}: MeaningListProps) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
      {meanings.map((meaning) => {
        const isSelected = selectedMeaningId === meaning.meaningId;
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
            <span className="text-custom text-sm font-medium">
              {meaning.translation}
            </span>
          </div>
        );
      })}
    </div>
  );
}
