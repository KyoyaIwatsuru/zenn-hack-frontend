import React from "react";
import Image from "next/image";

interface ModelSelectionButtonProps {
  modelType: "text2image" | "image2image" | "text2video";
  isSelected: boolean;
  onClick: () => void;
}

const modelConfig = {
  text2image: {
    icon: "/text2image.svg",
    tooltip: "text-to-image",
    label: "text2image",
    tooltipBg: "bg-main",
    selectedBorder: "border-main",
    selectedBg: "bg-green-50",
  },
  image2image: {
    icon: "/image2image.svg",
    tooltip: "image-to-image",
    label: "image2image",
    tooltipBg: "bg-blue",
    selectedBorder: "border-blue",
    selectedBg: "bg-blue-50",
  },
  text2video: {
    icon: "/text2video.svg",
    tooltip: "text-to-video",
    label: "text2video",
    tooltipBg: "bg-red",
    selectedBorder: "border-red",
    selectedBg: "bg-red-50",
  },
};

export function ModelSelectionButton({
  modelType,
  isSelected,
  onClick,
}: ModelSelectionButtonProps) {
  const config = modelConfig[modelType];

  return (
    <div
      className={`group relative flex cursor-pointer flex-col items-center rounded-lg border-2 p-3 ${
        isSelected
          ? `${config.selectedBorder} ${config.selectedBg}`
          : "border-gray-200 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="mb-1 flex h-12 w-12 items-center justify-center">
        <Image src={config.icon} alt={config.label} width={48} height={48} />
      </div>

      {/* ツールチップ */}
      <div
        className={`absolute bottom-[-32px] left-1/2 -translate-x-1/2 transform ${config.tooltipBg} pointer-events-none rounded px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
      >
        {config.tooltip}
      </div>
    </div>
  );
}
