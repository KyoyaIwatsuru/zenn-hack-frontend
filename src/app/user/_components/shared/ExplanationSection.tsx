import React, { ReactNode } from "react";
import { Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-custom hover:text-custom flex-shrink-0 p-2 hover:bg-gray-100"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
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
