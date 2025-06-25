import React from "react";
import Image from "next/image";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";

interface ModelSelectionButtonProps {
  modelType:
    | "text-to-image"
    | "image-to-image"
    | "text-to-video"
    | "image-to-video";
  isSelected: boolean;
  onClick: () => void;
}

const modelConfig = {
  "text-to-image": {
    selectedIcon: "/text-to-image.svg",
    notSelectedIcon: "/text-to-image_not-selected.svg",
    tooltip: "text-to-image",
    label: "text-to-image",
    tooltipBg: "bg-main",
  },
  "image-to-image": {
    selectedIcon: "/image-to-image.svg",
    notSelectedIcon: "/image-to-image_not-selected.svg",
    tooltip: "image-to-image",
    label: "image-to-image",
    tooltipBg: "bg-blue",
  },
  "text-to-video": {
    selectedIcon: "/text-to-video.svg",
    notSelectedIcon: "/text-to-video_not-selected.svg",
    tooltip: "text-to-video",
    label: "text-to-video",
    tooltipBg: "bg-red",
  },
  "image-to-video": {
    selectedIcon: "/image-to-video.svg",
    notSelectedIcon: "/image-to-video_not-selected.svg",
    tooltip: "image-to-video",
    label: "image-to-video",
    tooltipBg: "bg-purple",
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
    <SimpleTooltip
      content={config.tooltip}
      position="bottom"
      backgroundColor={config.tooltipBg}
      className="cursor-pointer"
    >
      <Image
        src={iconSrc}
        alt={config.label}
        width={56}
        height={56}
        className="h-18 w-18"
        onClick={onClick}
      />
    </SimpleTooltip>
  );
}
