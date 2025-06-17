import React from "react";

interface WordHeaderProps {
  word: string;
  pronunciation?: string;
}

export function WordHeader({ word, pronunciation }: WordHeaderProps) {
  return (
    <div>
      <h2 className="text-custom mb-1 text-2xl font-bold">{word}</h2>
      <p className="text-custom text-sm">[{pronunciation || ""}]</p>
    </div>
  );
}
