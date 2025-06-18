import React, { ReactNode } from "react";
import Image from "next/image";

interface ExplanationSectionProps {
  explanation: string;
  showEditButton?: boolean;
  onEdit?: () => void;
  children?: ReactNode;
}

export function ExplanationSection({
  explanation,
  showEditButton = false,
  onEdit,
  children,
}: ExplanationSectionProps) {
  if (showEditButton) {
    return (
      <div className="flex items-start gap-3">
        <div className="text-custom bg-secondary flex-1 rounded p-3 text-sm">
          <p>{explanation}</p>
        </div>
        <Image
          src={
            explanation && explanation.trim() !== ""
              ? "/note_noted.svg"
              : "/note_new.svg"
          }
          alt="編集"
          width={36}
          height={36}
          onClick={onEdit}
          className="flex-shrink-0 cursor-pointer transition-opacity hover:opacity-80"
        />
        {children}
      </div>
    );
  }

  return (
    <div className="text-custom bg-secondary rounded p-3 text-sm">
      <p>{explanation}</p>
    </div>
  );
}
