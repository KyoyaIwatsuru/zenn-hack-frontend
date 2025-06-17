import React from "react";

interface ExampleSectionProps {
  exampleEng?: string;
  exampleJpn?: string;
}

export function ExampleSection({
  exampleEng,
  exampleJpn,
}: ExampleSectionProps) {
  return (
    <div className="space-y-2 border-t border-gray-100 pt-4">
      <p className="text-custom text-base leading-relaxed">{exampleEng}</p>
      <p className="text-custom text-sm leading-relaxed">{exampleJpn}</p>
    </div>
  );
}
