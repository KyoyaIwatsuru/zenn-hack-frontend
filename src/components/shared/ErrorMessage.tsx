import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showRetry?: boolean;
  className?: string;
}

export function ErrorMessage({ 
  message, 
  onRetry, 
  retryText = "再読み込み",
  showRetry = true,
  className = "" 
}: ErrorMessageProps) {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="text-red-600 mb-4">{message}</div>
      {showRetry && onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="mt-4"
        >
          {retryText}
        </Button>
      )}
    </div>
  );
}