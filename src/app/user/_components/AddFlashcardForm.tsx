"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/shared";
import { useAddFlashcard } from "@/hooks";
import { Flashcard } from "@/types";

interface AddFlashcardFormProps {
  userId: string;
  existingFlashcards: Flashcard[];
  onSuccess?: () => void;
}

export function AddFlashcardForm({
  userId,
  existingFlashcards,
  onSuccess,
}: AddFlashcardFormProps) {
  const [word, setWord] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, error, isSuccess, addFlashcard, resetState } =
    useAddFlashcard();

  // 成功時の処理
  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!word.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await addFlashcard(word.trim(), userId, existingFlashcards);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
    if (error || isSuccess) {
      resetState();
    }
  };

  const handleReset = () => {
    setWord("");
    resetState();
  };

  return (
    <Card className="bg-primary w-full max-w-5xl shadow-sm">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">フラッシュカード追加</h3>
          <p className="text-muted-foreground text-sm">
            追加したい単語を入力してください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <Input
              type="text"
              placeholder="単語を入力..."
              value={word}
              onChange={handleInputChange}
              disabled={isLoading || isSubmitting}
              className="w-[50%]"
            />
          </div>

          <div className="flex justify-center gap-2">
            <Button
              type="submit"
              variant="outline"
              disabled={isLoading || isSubmitting || !word.trim()}
              className="w-24"
            >
              {isLoading || isSubmitting ? (
                <>
                  <LoadingSpinner size="small" message="" />
                  <span className="ml-2">追加中...</span>
                </>
              ) : (
                "追加"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading || isSubmitting || !word.trim()}
              className="w-24"
            >
              リセット
            </Button>
          </div>
        </form>

        {error && (
          <div className="flex justify-center">
            <Alert
              variant="destructive"
              className="!block w-[50%] !grid-cols-none"
            >
              <div className="flex flex-col space-y-1">
                <span className="font-medium">エラー</span>
                <span className="text-sm">{error}</span>
              </div>
            </Alert>
          </div>
        )}

        {isSuccess && (
          <div className="flex justify-center">
            <Alert className="!block w-[50%] !grid-cols-none border-green-200 bg-green-50 text-green-800">
              <div className="flex flex-col space-y-1">
                <span className="font-medium">成功</span>
                <span className="text-sm">
                  フラッシュカード「{word}」を追加しました。
                </span>
              </div>
            </Alert>
          </div>
        )}
      </div>
    </Card>
  );
}
