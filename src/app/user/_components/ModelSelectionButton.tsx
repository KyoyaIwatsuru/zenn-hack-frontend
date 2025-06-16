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
    selectedBorder: "border-main"
  },
  image2image: {
    icon: "/image2image.svg",
    tooltip: "image-to-image",
    label: "image2image",
    tooltipBg: "bg-blue",
    selectedBorder: "border-blue" //ここの色を変える
  },
  text2video: {
    icon: "/text2video.svg",
    tooltip: "text-to-video",
    label: "text2video",
    tooltipBg: "bg-red",
    selectedBorder: "border-red"
  }
};

export function ModelSelectionButton({
  modelType,
  isSelected,
  onClick,
}: ModelSelectionButtonProps) {
  const config = modelConfig[modelType];

  return (
    <div
      className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer relative group ${
        isSelected
          ? "border-main bg-sub/20"
          : "border-gray-200 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="w-12 h-12 mb-1 flex items-center justify-center">
        <Image 
          src={config.icon} 
          alt={config.label} 
          width={48}
          height={48}
        />
      </div>
      
      {/* ツールチップ */}
      <div className={`absolute bottom-[-32px] left-1/2 transform -translate-x-1/2 ${config.tooltipBg} text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap`}>
        {config.tooltip}
      </div>
    </div>
  );
}
