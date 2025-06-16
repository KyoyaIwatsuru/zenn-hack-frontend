import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flashcard } from "@/types";

interface MemoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard: Flashcard | null;
  memoText: string;
  onMemoTextChange: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function MemoModal({
  isOpen,
  onOpenChange,
  flashcard,
  memoText,
  onMemoTextChange,
  onSave,
  onCancel,
}: MemoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-custom">
            {flashcard?.word.word} のメモ
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={memoText}
            onChange={(e) => onMemoTextChange(e.target.value)}
            placeholder="メモを入力してください..."
            className="min-h-[120px] border-gray-200 focus:border-main"
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="border-gray-200 text-custom hover:bg-gray-50"
            >
              キャンセル
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              className="bg-main hover:bg-main/90 text-white"
            >
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}