"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Edit3, FileText, Check, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flashcard, Meaning } from "@/types/type";
import { MediaGenerationModal } from "./_components/MediaGenerationModal";
import { MediaComparisonModal } from "./_components/MediaComparisonModal";
import { AddMeaningPopover } from "./_components/AddMeaningPopover";
import { ProfileEditModal } from "./_components/ProfileEditModal";

const posTranslations: Record<string, string> = {
  noun: "名",
  pronoun: "代",
  intransitiveVerb: "自動",
  transitiveVerb: "他動",
  adjective: "形",
  adverb: "副",
  auxiliaryVerb: "助動",
  preposition: "前",
  article: "冠",
  interjection: "感",
  conjunction: "接",
  idiom: "熟語",
};

export default function UserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id || null;
  const userEmail = session?.user?.email || null;
  const [displayUserName, setDisplayUserName] = useState(session?.user?.name || null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState("");
  const [memoModalOpen, setMemoModalOpen] = useState(false);
  const [selectedMeanings, setSelectedMeanings] = useState<
    Record<string, string>
  >({});
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [currentMediaFlashcard, setCurrentMediaFlashcard] =
    useState<Flashcard | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [currentCompareFlashcard, setCurrentCompareFlashcard] =
    useState<Flashcard | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const loadFlashcards = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/flashcard/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.flashcards) {
        setFlashcards(data.flashcards);
      } else {
        setFlashcards([]);
      }
    } catch (err) {
      setError("フラッシュカードの読み込みに失敗しました");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // displayUserNameを初期化
  useEffect(() => {
    if (session?.user?.name && !displayUserName) {
      setDisplayUserName(session.user.name);
    }
  }, [session?.user?.name, displayUserName]);

  // 認証状態のチェックとリダイレクト
  useEffect(() => {
    if (status === "loading") return; // ローディング中は何もしない
    
    if (status === "unauthenticated" || !session?.user) {
      router.push("/"); // 未認証の場合はログインページにリダイレクト
      return;
    }
    
    if (userId) {
      loadFlashcards(); // 認証済みでuserIdがある場合のみフラッシュカードを読み込み
    }
  }, [status, session, userId, router, loadFlashcards]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleCheckFlag = async (flashcardId: string) => {
    const flashcard = flashcards.find((c) => c.flashcardId === flashcardId);
    if (!flashcard) return;

    const newCheckFlag = !flashcard.checkFlag;

    setFlashcards((prev) =>
      prev.map((card) =>
        card.flashcardId === flashcardId
          ? { ...card, checkFlag: newCheckFlag }
          : card
      )
    );

    try {
      const response = await fetch("/api/flashcard/update/checkFlag", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId,
          checkFlag: newCheckFlag,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      setFlashcards((prev) =>
        prev.map((card) =>
          card.flashcardId === flashcardId
            ? { ...card, checkFlag: !newCheckFlag }
            : card
        )
      );
      console.error("チェックフラグ更新エラー:", err);
    }
  };

  const handleUpdateMemo = async (flashcardId: string, memo: string) => {
    try {
      const response = await fetch("/api/flashcard/update/memo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId,
          memo,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      setFlashcards((prev) =>
        prev.map((card) =>
          card.flashcardId === flashcardId ? { ...card, memo } : card
        )
      );

      setEditingMemo(null);
      setMemoText("");
      setMemoModalOpen(false);
    } catch (err) {
      console.error("メモ更新エラー:", err);
    }
  };

  const startEditMemo = (flashcard: Flashcard) => {
    setEditingMemo(flashcard.flashcardId);
    setMemoText(flashcard.memo);
    setMemoModalOpen(true);
  };

  const closeMemoModal = () => {
    setEditingMemo(null);
    setMemoText("");
    setMemoModalOpen(false);
  };

  const selectMeaning = (flashcardId: string, meaningId: string) => {
    setSelectedMeanings((prev) => ({
      ...prev,
      [flashcardId]: meaningId,
    }));
  };

  const getSelectedMeaning = (flashcard: Flashcard) => {
    const selectedMeaningId = selectedMeanings[flashcard.flashcardId];
    if (selectedMeaningId) {
      return (
        flashcard.meanings.find((m) => m.meaningId === selectedMeaningId) ||
        flashcard.meanings[0]
      );
    }
    return flashcard.meanings[0];
  };

  const handleMeaningAdded = (flashcardId: string, newMeanings: Meaning[]) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.flashcardId === flashcardId
          ? { ...card, meanings: [...card.meanings, ...newMeanings] }
          : card
      )
    );
  };

  const openMediaModal = (flashcard: Flashcard) => {
    setCurrentMediaFlashcard(flashcard);
    setMediaModalOpen(true);
  };

  const selectMeaningInModal = (meaningId: string) => {
    if (currentMediaFlashcard) {
      setSelectedMeanings((prev) => ({
        ...prev,
        [currentMediaFlashcard.flashcardId]: meaningId,
      }));
    }
  };

  const handleMediaGenerated = (flashcardId: string, media: unknown) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.flashcardId === flashcardId
          ? { ...card, media: media as Flashcard["media"] }
          : card
      )
    );
  };

  const openCompareModal = (flashcard: Flashcard) => {
    setCurrentCompareFlashcard(flashcard);
    setCompareModalOpen(true);
  };

  const selectMeaningInCompareModal = (meaningId: string) => {
    if (currentCompareFlashcard) {
      setSelectedMeanings((prev) => ({
        ...prev,
        [currentCompareFlashcard.flashcardId]: meaningId,
      }));
    }
  };

  const handleComparisonSubmitted = () => {
    console.log("比較結果が送信されました");
  };

  const handleProfileUpdated = (newUserName: string) => {
    setDisplayUserName(newUserName);
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const currentEditingFlashcard = editingMemo
    ? flashcards.find((f) => f.flashcardId === editingMemo)
    : null;

  // 認証状態をチェック中はローディング表示
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-custom">読み込み中...</div>
      </div>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト待ち）
  if (status === "unauthenticated" || !session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="bg-main text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            <span className="font-medium">フラッシュカード</span>
            {displayUserName && (
              <div className="ml-4 flex items-center gap-2">
                <span className="text-sm opacity-90">
                  ようこそ、{displayUserName}さん
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openProfileModal}
                  className="text-white hover:bg-white/10 p-1 h-auto transition-all duration-200 hover:scale-110"
                  title="プロフィールを編集"
                >
                  <User className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-white hover:bg-white/10"
          >
            ログアウト
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <div className="text-custom">読み込み中...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-600">{error}</div>
            <Button
              variant="outline"
              onClick={() => userId && loadFlashcards()}
              className="mt-4"
            >
              再読み込み
            </Button>
          </div>
        )}

        {!isLoading &&
          !error &&
          flashcards.map((flashcard) => (
            <Card
              key={flashcard.flashcardId}
              className="bg-white shadow-sm border-0"
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-12 gap-6">
                  {/* 左側：チェックボックス + 単語情報 + 画像 */}
                  <div className="col-span-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-colors mt-1 ${
                          flashcard.checkFlag
                            ? "bg-main border-main"
                            : "border-main bg-transparent hover:bg-main/10"
                        }`}
                        onClick={() => toggleCheckFlag(flashcard.flashcardId)}
                      >
                        {flashcard.checkFlag && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-custom mb-1">
                          {flashcard.word.word}
                        </h2>
                        <p className="text-custom text-sm">
                          [{getSelectedMeaning(flashcard)?.pronunciation || ""}]
                        </p>
                      </div>
                    </div>

                    <div
                      className="bg-secondary rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => openMediaModal(flashcard)}
                    >
                      <div className="w-32 h-32 rounded-lg mx-auto mb-2 overflow-hidden relative">
                        {flashcard.media?.mediaUrls?.[0] ? (
                          <Image
                            src={flashcard.media.mediaUrls[0]}
                            alt={`${flashcard.word.word} - ${getSelectedMeaning(flashcard)?.translation}`}
                            fill
                            className="object-cover rounded-lg"
                            onError={() => {
                              // Next.js Imageコンポーネントでのエラーハンドリングは別途実装が必要
                              console.error("Failed to load image:", flashcard.media.mediaUrls[0]);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                            <div className="text-gray-500 text-xs">画像</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6 space-y-4">
                    {/* 意味セクション - 2列表示 */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {flashcard.meanings.map((meaning) => {
                          const isSelected =
                            getSelectedMeaning(flashcard).meaningId ===
                            meaning.meaningId;
                          return (
                            <div
                              key={meaning.meaningId}
                              className={`flex items-center gap-2 cursor-pointer p-2 rounded transition-colors ${
                                isSelected ? "bg-sub/30" : "hover:bg-gray-50"
                              }`}
                              onClick={() =>
                                selectMeaning(
                                  flashcard.flashcardId,
                                  meaning.meaningId
                                )
                              }
                            >
                              <Badge className="bg-sub text-custom border-0 text-sm px-2 py-1 flex-shrink-0">
                                {posTranslations[meaning.pos] || meaning.pos}
                              </Badge>
                              <span className="text-custom font-medium text-sm">
                                {meaning.translation}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <AddMeaningPopover
                        flashcardId={flashcard.flashcardId}
                        wordId={flashcard.word.wordId}
                        currentMeanings={flashcard.meanings}
                        onMeaningAdded={(newMeanings) =>
                          handleMeaningAdded(flashcard.flashcardId, newMeanings)
                        }
                      />
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <p className="text-custom text-sm leading-relaxed">
                        {getSelectedMeaning(flashcard)?.exampleEng}
                      </p>
                      <p className="text-custom text-sm leading-relaxed">
                        {getSelectedMeaning(flashcard)?.exampleJpn}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="text-sm text-custom bg-secondary p-3 rounded flex-1">
                        <p>{flashcard.word.explanation}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditMemo(flashcard)}
                        className="text-custom hover:text-custom hover:bg-gray-100 p-2 flex-shrink-0"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCompareModal(flashcard)}
                        className="text-custom border-gray-200 hover:bg-gray-50"
                      >
                        画像比較
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <MediaGenerationModal
        isOpen={mediaModalOpen}
        onOpenChange={setMediaModalOpen}
        flashcard={currentMediaFlashcard}
        selectedMeaning={
          currentMediaFlashcard
            ? getSelectedMeaning(currentMediaFlashcard)
            : null
        }
        onMeaningSelect={selectMeaningInModal}
        onMediaGenerated={handleMediaGenerated}
      />

      <MediaComparisonModal
        isOpen={compareModalOpen}
        onOpenChange={setCompareModalOpen}
        flashcard={currentCompareFlashcard}
        selectedMeaning={
          currentCompareFlashcard
            ? getSelectedMeaning(currentCompareFlashcard)
            : null
        }
        onMeaningSelect={selectMeaningInCompareModal}
        onComparisonSubmitted={handleComparisonSubmitted}
      />

      <Dialog open={memoModalOpen} onOpenChange={setMemoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-custom">
              {currentEditingFlashcard?.word.word} のメモ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="メモを入力してください..."
              className="min-h-[120px] border-gray-200 focus:border-main"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={closeMemoModal}
                className="border-gray-200 text-custom hover:bg-gray-50"
              >
                キャンセル
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  editingMemo && handleUpdateMemo(editingMemo, memoText)
                }
                className="bg-main hover:bg-main/90 text-white"
              >
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProfileEditModal
        isOpen={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        currentUserName={displayUserName || ""}
        currentEmail={userEmail || ""}
        userId={userId || ""}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}
