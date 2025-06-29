import React, { ReactNode } from "react";
import Image from "next/image";

interface ExplanationSectionProps {
  explanation: string;
  coreMeaning?: string;
  showEditButton?: boolean;
  onEdit?: () => void;
  children?: ReactNode;
}

export function ExplanationSection({
  explanation,
  coreMeaning,
  showEditButton = false,
  onEdit,
  children,
}: ExplanationSectionProps) {
  if (showEditButton) {
    return (
      <div className="flex items-start gap-3">
        <div className="text-custom bg-secondary flex-1 space-y-2 rounded p-3 text-sm">
          <div>
            <span className="font-medium">【解説】</span>
            {explanation}
          </div>
          {coreMeaning && (
            <div>
              <span className="font-medium">【コアミーニング】</span>
              {coreMeaning}
            </div>
          )}
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
    <div className="text-custom bg-secondary space-y-2 rounded p-3 text-sm">
      <div>
        <span className="font-medium">【解説】</span>
        {explanation}
      </div>
      {coreMeaning && (
        <div>
          <span className="font-medium">【コアミーニング】</span>
          {coreMeaning}
        </div>
      )}
    </div>
  );
}
