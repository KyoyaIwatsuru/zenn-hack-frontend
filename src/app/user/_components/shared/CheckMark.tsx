import React from "react";
import { Check } from "lucide-react";

interface CheckMarkProps {
  isChecked: boolean;
  onClick?: () => void;
  isInteractive?: boolean;
}

export function CheckMark({
  isChecked,
  onClick,
  isInteractive = false,
}: CheckMarkProps) {
  return (
    <div
      className={`mt-1 flex h-6 w-6 items-center justify-center rounded border-2 transition-colors ${
        isChecked
          ? "bg-main border-main"
          : isInteractive
            ? "border-main hover:bg-main/10 cursor-pointer bg-transparent"
            : "bg-main border-main"
      }`}
      onClick={isInteractive ? onClick : undefined}
    >
      {isChecked && <Check className="h-4 w-4 text-white" />}
    </div>
  );
}
