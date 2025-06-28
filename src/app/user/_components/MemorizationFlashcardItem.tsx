import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Flashcard, Meaning } from "@/types";
import {
  CheckMark,
  WordHeader,
  MediaDisplay,
  MeaningList,
  ExampleSection,
  ExplanationSection,
} from "./shared";
import { VisibilitySettings } from "./VisibilityControlPanel";

interface MemorizationFlashcardItemProps {
  flashcard: Flashcard;
  selectedMeaning: Meaning;
  onCheckFlagToggle: (flashcardId: string) => void;
  onMemoEdit: (flashcard: Flashcard) => void;
  globalVisibilitySettings?: VisibilitySettings;
  onVisibilityUpdate?: () => void;
}

export function MemorizationFlashcardItem({
  flashcard,
  selectedMeaning,
  onCheckFlagToggle,
  onMemoEdit,
  globalVisibilitySettings,
  onVisibilityUpdate,
}: MemorizationFlashcardItemProps) {
  // 各要素の表示/非表示状態を管理
  const [visibilityState, setVisibilityState] = useState({
    word: true,
    image: true,
    meanings: true,
    examples: true,
    explanation: true,
  });

  // グローバル設定が変更された場合にローカル状態を更新
  React.useEffect(() => {
    if (globalVisibilitySettings) {
      setVisibilityState(globalVisibilitySettings);
      // 設定更新完了を通知（親コンポーネントで処理状況を管理するため）
      setTimeout(() => {
        onVisibilityUpdate?.();
      }, 100); // 少し遅延を入れてスムーズな更新を演出
    }
  }, [globalVisibilitySettings, onVisibilityUpdate]);

  // 要素の表示/非表示を切り替える関数（個別クリック用）
  const toggleVisibility = (element: keyof typeof visibilityState) => {
    setVisibilityState((prev) => ({
      ...prev,
      [element]: !prev[element],
    }));
  };

  return (
    <Card className="bg-primary w-full max-w-5xl border-0 shadow-sm">
      <CardContent className="px-6">
        <div className="flex gap-6">
          {/* 左側：チェックボックス + 単語情報 + 画像 (固定幅) */}
          <div className="w-48 flex-shrink-0 space-y-4">
            <div className="flex items-start gap-3">
              {/* チェックボックス：常に表示、クリック可能 */}
              <CheckMark
                isChecked={flashcard.checkFlag}
                onClick={() => onCheckFlagToggle(flashcard.flashcardId)}
                isInteractive={true}
              />

              {/* 単語（発音含む）：クリックで表示/非表示切り替え */}
              <div
                className="cursor-pointer transition-opacity duration-200"
                onClick={() => toggleVisibility("word")}
                style={{
                  opacity: visibilityState.word ? 1 : 0.3,
                }}
              >
                {visibilityState.word ? (
                  <WordHeader
                    word={flashcard.word.word}
                    pronunciation={selectedMeaning?.pronunciation}
                  />
                ) : (
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                )}
              </div>
            </div>

            {/* 画像：クリックで表示/非表示切り替え（モーダル機能はOFF） */}
            <div
              className="cursor-pointer transition-opacity duration-200"
              onClick={() => toggleVisibility("image")}
              style={{
                opacity: visibilityState.image ? 1 : 0.3,
              }}
            >
              {visibilityState.image ? (
                <MediaDisplay
                  mediaUrls={flashcard.media?.mediaUrls}
                  word={flashcard.word.word}
                  translation={selectedMeaning?.translation}
                  onClick={() => {}} // 画像クリック機能はOFF
                  isInteractive={false}
                  mode="generate"
                />
              ) : (
                <div className="flex h-40 w-40 animate-pulse items-center justify-center rounded-lg bg-gray-200">
                  <span className="text-sm text-gray-400">画像</span>
                </div>
              )}
            </div>
          </div>

          {/* 中央：意味・例文・説明 (可変幅) */}
          <div className="flex-1 space-y-4">
            {/* 意味セクション：クリックで表示/非表示切り替え（例文変更機能はOFF） */}
            <div
              className="cursor-pointer transition-opacity duration-200"
              onClick={() => toggleVisibility("meanings")}
              style={{
                opacity: visibilityState.meanings ? 1 : 0.3,
              }}
            >
              {visibilityState.meanings ? (
                <MeaningList
                  meanings={flashcard.meanings}
                  selectedMeaningId={selectedMeaning.meaningId}
                  onMeaningSelect={() => {}} // 意味選択機能はOFF
                />
              ) : (
                <div className="flex h-20 animate-pulse items-center justify-center rounded bg-gray-200">
                  <span className="text-sm text-gray-400">意味</span>
                </div>
              )}
            </div>

            {/* 例文セクション：クリックで表示/非表示切り替え */}
            <div
              className="cursor-pointer transition-opacity duration-200"
              onClick={() => toggleVisibility("examples")}
              style={{
                opacity: visibilityState.examples ? 1 : 0.3,
              }}
            >
              {visibilityState.examples ? (
                <ExampleSection
                  exampleEng={selectedMeaning?.exampleEng}
                  exampleJpn={selectedMeaning?.exampleJpn}
                />
              ) : (
                <div className="flex h-16 animate-pulse items-center justify-center rounded bg-gray-200">
                  <span className="text-sm text-gray-400">例文</span>
                </div>
              )}
            </div>

            {/* 説明セクション：クリックで表示/非表示切り替え */}
            <div
              className="cursor-pointer transition-opacity duration-200"
              onClick={() => toggleVisibility("explanation")}
              style={{
                opacity: visibilityState.explanation ? 1 : 0.3,
              }}
            >
              {visibilityState.explanation ? (
                <ExplanationSection
                  explanation={flashcard.word.explanation}
                  showEditButton={false}
                />
              ) : (
                <div className="flex h-12 animate-pulse items-center justify-center rounded bg-gray-200">
                  <span className="text-sm text-gray-400">説明</span>
                </div>
              )}
            </div>
          </div>

          {/* 右側：メモのみ (固定幅) - 意味追加・削除ボタンは非表示 */}
          <div className="flex w-16 flex-shrink-0 flex-col items-center justify-end pb-4">
            {/* メモ：編集可能（表示非表示は不可） */}
            <Image
              src={
                flashcard.memo && flashcard.memo.trim() !== ""
                  ? "/note_noted.svg"
                  : "/note_new.svg"
              }
              alt="編集"
              width={36}
              height={36}
              onClick={() => onMemoEdit(flashcard)}
              className="cursor-pointer transition-opacity hover:opacity-80"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
