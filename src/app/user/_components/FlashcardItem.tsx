import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Flashcard, Meaning } from "@/types";
import { MediaCreateResult } from "@/types/ui";
import { MeaningAddPopover } from "./MeaningAddPopover";
import {
  CheckMark,
  WordHeader,
  MediaDisplay,
  MeaningList,
  ExampleSection,
  ExplanationSection,
} from "./shared";
import { MeaningDeletePopover } from "./MeaningDeletePopover";
import { VisibilitySettings } from "./VisibilityControlPanel";

interface FlashcardItemProps {
  flashcard: Flashcard;
  selectedMeaning: Meaning;
  mediaCreateResult?: MediaCreateResult;
  onCheckFlagToggle: (flashcardId: string) => void;
  onMeaningSelect: (flashcardId: string, meaningId: string) => void;
  onMeaningAdded: (flashcardId: string, newMeanings: Meaning[]) => void;
  onMeaningDeleted: (flashcardId: string, deletedMeanings: Meaning[]) => void;
  onMediaClick: (flashcard: Flashcard) => void;
  onMemoEdit: (flashcard: Flashcard) => void;
  // 表示制御のオプション
  showCheckbox?: boolean;
  showWordHeader?: boolean;
  showMedia?: boolean;
  showMeanings?: boolean;
  showExamples?: boolean;
  showExplanation?: boolean;
  showMeaningActions?: boolean; // 意味追加・削除ボタン
  showMemo?: boolean;
  // 機能制御のオプション
  enableMediaClick?: boolean; // 画像クリック機能
  enableCheckToggle?: boolean; // チェックマーク機能
  enableMeaningSelect?: boolean; // 意味選択機能（例文変更）
  enableMemoEdit?: boolean; // メモ編集機能
  // スタイル制御のオプション
  borderColor?: string; // ボーダー色（指定された場合border-4が適用される）
  // メディア表示モード
  mediaMode?: "generate" | "compare"; // MediaDisplayのモード
  // 暗記モード用のオプション
  memorizationMode?: boolean; // 暗記モードかどうか
  globalVisibilitySettings?: VisibilitySettings; // グローバル表示設定
  onVisibilityUpdate?: () => void; // 表示設定更新完了通知
}

export function FlashcardItem({
  flashcard,
  selectedMeaning,
  mediaCreateResult,
  onCheckFlagToggle,
  onMeaningSelect,
  onMeaningAdded,
  onMeaningDeleted,
  onMediaClick,
  onMemoEdit,
  // デフォルトですべて表示
  showCheckbox = true,
  showWordHeader = true,
  showMedia = true,
  showMeanings = true,
  showExamples = true,
  showExplanation = true,
  showMeaningActions = true,
  showMemo = true,
  // デフォルトですべての機能を有効
  enableMediaClick = true,
  enableCheckToggle = true,
  enableMeaningSelect = true,
  enableMemoEdit = true,
  // スタイル制御のオプション
  borderColor,
  // メディア表示モード
  mediaMode = "generate", // デフォルトは生成モード
  // 暗記モード用のオプション
  memorizationMode = false,
  globalVisibilitySettings,
  onVisibilityUpdate,
}: FlashcardItemProps) {
  // 暗記モード用の個別表示状態管理
  const [localVisibilityState, setLocalVisibilityState] = useState({
    word: true,
    image: true,
    meanings: true,
    examples: true,
    explanation: true,
  });

  // グローバル設定が変更された場合にローカル状態を更新
  React.useEffect(() => {
    if (memorizationMode && globalVisibilitySettings) {
      setLocalVisibilityState(globalVisibilitySettings);
      // 設定更新完了を通知（親コンポーネントで処理状況を管理するため）
      setTimeout(() => {
        onVisibilityUpdate?.();
      }, 100); // 少し遅延を入れてスムーズな更新を演出
    }
  }, [memorizationMode, globalVisibilitySettings, onVisibilityUpdate]);

  // 要素の表示/非表示を切り替える関数（暗記モードの個別クリック用）
  const toggleVisibility = (element: keyof typeof localVisibilityState) => {
    if (memorizationMode) {
      setLocalVisibilityState((prev) => ({
        ...prev,
        [element]: !prev[element],
      }));
    }
  };

  // 実際の表示状態を決定（暗記モードの場合はlocalVisibilityState、通常モードの場合はprops）
  const getVisibility = (element: keyof typeof localVisibilityState) => {
    if (memorizationMode) {
      return localVisibilityState[element];
    }
    // 通常モードの場合はpropsの値を使用
    switch (element) {
      case "word":
        return showWordHeader;
      case "image":
        return showMedia;
      case "meanings":
        return showMeanings;
      case "examples":
        return showExamples;
      case "explanation":
        return showExplanation;
      default:
        return true;
    }
  };

  // プレースホルダーコンポーネント
  const Placeholder = ({
    children,
    height = "h-8",
  }: {
    children: string;
    height?: string;
  }) => (
    <div
      className={`flex ${height} animate-pulse items-center justify-center rounded bg-gray-200`}
    >
      <span className="text-sm text-gray-400">{children}</span>
    </div>
  );
  return (
    <Card
      className={`bg-primary w-full max-w-5xl shadow-sm ${borderColor ? `border-4 ${borderColor}` : "border-0"}`}
    >
      <CardContent className="px-6">
        <div className="flex gap-6">
          {/* 左側：チェックボックス + 単語情報 + 画像 (固定幅) */}
          <div className="w-48 flex-shrink-0 space-y-4">
            <div className="flex items-start gap-3">
              {showCheckbox && (
                <CheckMark
                  isChecked={flashcard.checkFlag}
                  onClick={() => onCheckFlagToggle(flashcard.flashcardId)}
                  isInteractive={enableCheckToggle}
                />
              )}

              {/* 単語ヘッダー：暗記モードの場合はクリック可能 */}
              {memorizationMode ? (
                <div
                  className="cursor-pointer transition-opacity duration-200"
                  onClick={() => toggleVisibility("word")}
                  style={{
                    opacity: getVisibility("word") ? 1 : 0.3,
                  }}
                >
                  {getVisibility("word") ? (
                    <WordHeader
                      word={flashcard.word.word}
                      pronunciation={selectedMeaning?.pronunciation}
                    />
                  ) : (
                    <Placeholder height="h-8">単語</Placeholder>
                  )}
                </div>
              ) : (
                showWordHeader && (
                  <WordHeader
                    word={flashcard.word.word}
                    pronunciation={selectedMeaning?.pronunciation}
                  />
                )
              )}
            </div>

            {/* 画像：暗記モードの場合はクリック可能 */}
            {memorizationMode ? (
              <div
                className="cursor-pointer transition-opacity duration-200"
                onClick={() => toggleVisibility("image")}
                style={{
                  opacity: getVisibility("image") ? 1 : 0.3,
                }}
              >
                {getVisibility("image") ? (
                  <MediaDisplay
                    mediaUrls={flashcard.media?.mediaUrls}
                    word={flashcard.word.word}
                    translation={selectedMeaning?.translation}
                    onClick={() => {}} // 暗記モードでは画像クリック機能はOFF
                    isInteractive={false}
                    mode={mediaMode}
                  />
                ) : (
                  <div className="flex h-40 w-40 animate-pulse items-center justify-center rounded-lg bg-gray-200">
                    <span className="text-sm text-gray-400">Media</span>
                  </div>
                )}
              </div>
            ) : (
              showMedia && (
                <MediaDisplay
                  mediaUrls={flashcard.media?.mediaUrls}
                  word={flashcard.word.word}
                  translation={selectedMeaning?.translation}
                  onClick={() => onMediaClick(flashcard)}
                  isInteractive={enableMediaClick}
                  status={mediaCreateResult?.status}
                  error={mediaCreateResult?.error}
                  mode={mediaMode}
                />
              )
            )}
          </div>

          {/* 中央：意味・例文・説明 (可変幅) */}
          <div className="flex-1 space-y-4">
            {/* 意味セクション */}
            {memorizationMode ? (
              <div
                className="cursor-pointer transition-opacity duration-200"
                onClick={() => toggleVisibility("meanings")}
                style={{
                  opacity: getVisibility("meanings") ? 1 : 0.3,
                }}
              >
                {getVisibility("meanings") ? (
                  <MeaningList
                    meanings={flashcard.meanings}
                    selectedMeaningId={null}
                    onMeaningSelect={() => {}} // 暗記モードでは意味選択機能はOFF
                    flashcardMediaMeaningId={flashcard.media?.meaningId}
                  />
                ) : (
                  <Placeholder height="h-20">意味</Placeholder>
                )}
              </div>
            ) : (
              showMeanings && (
                <div className="space-y-4">
                  <MeaningList
                    meanings={flashcard.meanings}
                    selectedMeaningId={selectedMeaning.meaningId}
                    onMeaningSelect={
                      enableMeaningSelect
                        ? (meaningId) =>
                            onMeaningSelect(flashcard.flashcardId, meaningId)
                        : () => {}
                    }
                    flashcardMediaMeaningId={flashcard.media?.meaningId}
                  />
                </div>
              )
            )}

            {/* 例文セクション */}
            {memorizationMode ? (
              <div
                className="cursor-pointer transition-opacity duration-200"
                onClick={() => toggleVisibility("examples")}
                style={{
                  opacity: getVisibility("examples") ? 1 : 0.3,
                }}
              >
                {getVisibility("examples") ? (
                  (() => {
                    // flashcard.media?.meaningIdがnullでない場合は、そのMeaningの例文を使用
                    const targetMeaning = flashcard.media?.meaningId
                      ? flashcard.meanings.find(
                          (m) => m.meaningId === flashcard.media?.meaningId
                        )
                      : selectedMeaning;

                    return (
                      <ExampleSection
                        exampleEng={targetMeaning?.exampleEng}
                        exampleJpn={targetMeaning?.exampleJpn}
                      />
                    );
                  })()
                ) : (
                  <Placeholder height="h-16">例文</Placeholder>
                )}
              </div>
            ) : (
              showExamples && (
                <ExampleSection
                  exampleEng={selectedMeaning?.exampleEng}
                  exampleJpn={selectedMeaning?.exampleJpn}
                />
              )
            )}

            {/* 説明セクション */}
            {memorizationMode ? (
              <div
                className="cursor-pointer transition-opacity duration-200"
                onClick={() => toggleVisibility("explanation")}
                style={{
                  opacity: getVisibility("explanation") ? 1 : 0.3,
                }}
              >
                {getVisibility("explanation") ? (
                  <ExplanationSection
                    explanation={flashcard.word.explanation}
                    coreMeaning={flashcard.word.coreMeaning}
                    showEditButton={false}
                  />
                ) : (
                  <Placeholder height="h-12">説明</Placeholder>
                )}
              </div>
            ) : (
              showExplanation && (
                <ExplanationSection
                  explanation={flashcard.word.explanation}
                  coreMeaning={flashcard.word.coreMeaning}
                  showEditButton={false}
                />
              )
            )}
          </div>

          {/* 右側：ボタン類 (固定幅) */}
          {(showMeaningActions || showMemo) && (
            <div className="flex w-16 flex-shrink-0 flex-col items-center justify-between pb-4">
              {/* 意味追加・削除ボタン：暗記モードでは非表示 */}
              {!memorizationMode && showMeaningActions && (
                <div className="flex">
                  <MeaningAddPopover
                    flashcardId={flashcard.flashcardId}
                    wordId={flashcard.word.wordId}
                    currentMeanings={flashcard.meanings}
                    onMeaningAdded={(newMeanings) =>
                      onMeaningAdded(flashcard.flashcardId, newMeanings)
                    }
                  />
                  <MeaningDeletePopover
                    flashcardId={flashcard.flashcardId}
                    currentMeanings={flashcard.meanings}
                    onMeaningDeleted={(deletedMeanings) =>
                      onMeaningDeleted(flashcard.flashcardId, deletedMeanings)
                    }
                  />
                </div>
              )}

              {/* 暗記モードの場合、意味追加・削除ボタンがない分のスペースを空にする */}
              {memorizationMode && showMeaningActions && <div />}

              {showMemo && (
                <Image
                  src={
                    flashcard.memo && flashcard.memo.trim() !== ""
                      ? "/note_noted.svg"
                      : "/note_new.svg"
                  }
                  alt="編集"
                  width={36}
                  height={36}
                  onClick={
                    enableMemoEdit ? () => onMemoEdit(flashcard) : undefined
                  }
                  className={
                    enableMemoEdit
                      ? "cursor-pointer transition-opacity hover:opacity-80"
                      : "cursor-not-allowed opacity-50"
                  }
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
