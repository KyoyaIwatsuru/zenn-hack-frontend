import React from "react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface SimpleTooltipProps {
  content: string;
  position?: TooltipPosition;
  backgroundColor?: string;
  children: React.ReactNode;
  className?: string;
}

const getPositionClasses = (position: TooltipPosition) => {
  switch (position) {
    case "top":
      return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    case "bottom":
      return "top-full left-1/2 -translate-x-1/2 mt-2";
    case "left":
      return "right-full top-1/2 -translate-y-1/2 mr-2";
    case "right":
      return "left-full top-1/2 -translate-y-1/2 ml-2";
    default:
      return "bottom-full left-1/2 -translate-x-1/2 mb-2";
  }
};

export function SimpleTooltip({
  content,
  position = "bottom",
  backgroundColor = "bg-gray-800",
  children,
  className = "",
}: SimpleTooltipProps) {
  const positionClasses = getPositionClasses(position);

  return (
    <div className={`group relative ${className}`}>
      {children}

      {/* ツールチップ */}
      <div
        className={`absolute ${positionClasses} ${backgroundColor} pointer-events-none z-50 rounded px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
      >
        {content}
      </div>
    </div>
  );
}
