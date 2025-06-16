import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

export function LoadingSpinner({
  message = "読み込み中...",
  size = "medium",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "py-4",
    medium: "py-8",
    large: "py-12",
  };

  return (
    <div className={`text-center ${sizeClasses[size]} ${className}`}>
      <div className="text-custom">{message}</div>
    </div>
  );
}
