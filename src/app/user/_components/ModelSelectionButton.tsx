import React from "react";
import Image from "next/image";

interface ModelSelectionButtonProps {
  modelType: "text2image" | "image2image" | "text2video";
  isSelected: boolean;
  onClick: () => void;
}

const modelConfig = {
  text2image: {
    selectedIcon: "/text2image.svg",
    notSelectedIcon: "/text2image_notselected.svg",
    tooltip: "text-to-image",
    label: "text2image",
    tooltipBg: "bg-main",
  },
  image2image: {
    selectedIcon: "/image2image.svg",
    notSelectedIcon: "/image2image_notselected.svg",
    tooltip: "image-to-image",
    label: "image2image",
    tooltipBg: "bg-blue",
  },
  text2video: {
    selectedIcon: "/text2video.svg",
    notSelectedIcon: "/text2video_notselected.svg",
    tooltip: "text-to-video",
    label: "text2video",
    tooltipBg: "bg-red",
  },
};

export function ModelSelectionButton({
  modelType,
  isSelected,
  onClick,
}: ModelSelectionButtonProps) {
  const config = modelConfig[modelType];
  const iconSrc = isSelected ? config.selectedIcon : config.notSelectedIcon;

  return (
    <div className="group relative cursor-pointer" onClick={onClick}>
      <Image
        src={iconSrc}
        alt={config.label}
        width={56}
        height={56}
        className="h-18 w-18"
      />

      {/* ツールチップ */}
      <div
        className={`absolute bottom-[-32px] left-1/2 -translate-x-1/2 transform ${config.tooltipBg} pointer-events-none rounded px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
      >
        {config.tooltip}
      </div>
    </div>
  );
}
