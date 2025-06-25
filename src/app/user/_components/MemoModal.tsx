import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flashcard } from "@/types";
import { ModalLayout } from "@/components/layout";

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
    <ModalLayout
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`${flashcard?.word.word} のメモ`}
    >
      <div className="space-y-4">
        <Textarea
          value={memoText}
          onChange={(e) => onMemoTextChange(e.target.value)}
          placeholder="メモを入力してください..."
          className="focus:border-main min-h-[120px] border-gray-200"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-custom border-gray-200 hover:bg-gray-50"
          >
            キャンセル
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            className="bg-main hover-green text-white"
          >
            保存
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}
