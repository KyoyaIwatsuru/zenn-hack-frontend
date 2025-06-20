"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Flashcard, Meaning } from "@/types";
import { useFlashcards, useTemplates } from "@/hooks";
import { DashboardLayout } from "@/components/layout";
import { UserHeader } from "./_components/UserHeader";
import { FlashcardList } from "./_components/FlashcardList";
import { GeneratedFlashcardList } from "./_components/GeneratedFlashcardList";
import { MemoModal } from "./_components/MemoModal";
import { MediaCreateModal } from "./_components/MediaCreateModal";
import { ComparisonUpdateModal } from "./_components/ComparisonUpdateModal";
import { UserUpdateModal } from "./_components/UserUpdateModal";

export default function UserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id || null;
  const userEmail = session?.user?.email || null;
  const [displayUserName, setDisplayUserName] = useState(
    session?.user?.name || null
  );

  // フラッシュカード関連の状態とロジック
  const {
    flashcards,
    isLoading: isFlashcardsLoading,
    error: flashcardsError,
    loadFlashcards,
    updateCheckFlag,
    updateMemo,
    addMeanings,
  } = useFlashcards();

  // テンプレート関連の状態とロジック
  const {
    templates,
    isLoading: isTemplatesLoading,
    error: templatesError,
    loadTemplates,
  } = useTemplates();

  // UI状態管理
  const [selectedMeanings, setSelectedMeanings] = useState<
    Record<string, string>
  >({});

  // メモモーダル関連
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState("");
  const [memoModalOpen, setMemoModalOpen] = useState(false);

  // メディア関連モーダル
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [currentMediaFlashcard, setCurrentMediaFlashcard] =
    useState<Flashcard | null>(null);

  // 比較関連モーダル
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [currentCompareFlashcard, setCurrentCompareFlashcard] =
    useState<Flashcard | null>(null);

  // プロフィールモーダル
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // タブ状態
  const [currentTab, setCurrentTab] = useState("all");

  // displayUserNameを初期化
  useEffect(() => {
    if (session?.user?.name && !displayUserName) {
      setDisplayUserName(session.user.name);
    }
  }, [session?.user?.name, displayUserName]);

  // 認証状態のチェックとリダイレクト
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user) {
      router.push("/");
      return;
    }

    if (userId) {
      loadFlashcards(userId);
      loadTemplates();
    }
  }, [status, session, userId, router, loadFlashcards, loadTemplates]);

  // ログアウト処理
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // 意味選択処理
  const selectMeaning = (flashcardId: string, meaningId: string) => {
    setSelectedMeanings((prev) => ({
      ...prev,
      [flashcardId]: meaningId,
    }));
  };

  // 意味追加処理
  const handleMeaningAdded = (flashcardId: string, newMeanings: Meaning[]) => {
    addMeanings(flashcardId, newMeanings);
  };

  // メモ編集開始
  const startEditMemo = (flashcard: Flashcard) => {
    setEditingMemo(flashcard.flashcardId);
    setMemoText(flashcard.memo);
    setMemoModalOpen(true);
  };

  // メモ更新処理
  const handleUpdateMemo = async () => {
    if (!editingMemo) return;

    try {
      await updateMemo(editingMemo, memoText);
      closeMemoModal();
    } catch (err) {
      console.error("メモ更新エラー:", err);
    }
  };

  // メモモーダルを閉じる
  const closeMemoModal = () => {
    setEditingMemo(null);
    setMemoText("");
    setMemoModalOpen(false);
  };

  // メディアモーダルを開く（画像生成用）
  const openMediaModal = (flashcard: Flashcard) => {
    setCurrentMediaFlashcard(flashcard);
    setMediaModalOpen(true);
  };

  // 比較モーダルを開く（画像比較用）
  const openCompareModal = (flashcard: Flashcard) => {
    setCurrentCompareFlashcard(flashcard);
    setCompareModalOpen(true);
  };

  // タブ変更ハンドラ
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  // プロフィールモーダルを開く
  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  // プロフィール更新後の処理
  const handleProfileUpdated = (newUserName: string) => {
    setDisplayUserName(newUserName);
  };

  // 比較モーダル内での意味選択
  const selectMeaningInModal = (
    meaningId: string,
    flashcard: Flashcard | null
  ) => {
    if (flashcard) {
      setSelectedMeanings((prev) => ({
        ...prev,
        [flashcard.flashcardId]: meaningId,
      }));
    }
  };

  // 比較提出処理
  const handleComparisonSubmitted = () => {
    console.log("比較結果が送信されました");
  };

  // 選択された意味を取得する関数
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

  // 現在編集中のフラッシュカード
  const currentEditingFlashcard = editingMemo
    ? flashcards.find((f) => f.flashcardId === editingMemo)
    : null;

  // 認証状態をチェック中はローディング表示
  if (status === "loading") {
    return (
      <div className="bg-primary flex min-h-screen items-center justify-center">
        <div className="text-custom">読み込み中...</div>
      </div>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト待ち）
  if (status === "unauthenticated" || !session?.user) {
    return null;
  }

  return (
    <DashboardLayout
      header={
        <UserHeader
          displayUserName={displayUserName}
          onProfileClick={openProfileModal}
          onLogout={handleLogout}
          currentTab={currentTab}
          onTabChange={handleTabChange}
        />
      }
    >
      {/* タブコンテンツ */}
      {currentTab === "all" ? (
        <FlashcardList
          flashcards={flashcards}
          isLoading={isFlashcardsLoading}
          error={flashcardsError || ""}
          selectedMeanings={selectedMeanings}
          onCheckFlagToggle={(flashcardId) => {
            const flashcard = flashcards.find(
              (c) => c.flashcardId === flashcardId
            );
            if (flashcard) {
              updateCheckFlag(flashcardId, !flashcard.checkFlag);
            }
          }}
          onMeaningSelect={selectMeaning}
          onMeaningAdded={handleMeaningAdded}
          onMediaClick={openMediaModal}
          onMemoEdit={startEditMemo}
          onRetry={() => userId && loadFlashcards(userId)}
        />
      ) : (
        <GeneratedFlashcardList
          flashcards={flashcards}
          isLoading={isFlashcardsLoading}
          error={flashcardsError || ""}
          selectedMeanings={selectedMeanings}
          onCheckFlagToggle={(flashcardId) => {
            const flashcard = flashcards.find(
              (c) => c.flashcardId === flashcardId
            );
            if (flashcard) {
              updateCheckFlag(flashcardId, !flashcard.checkFlag);
            }
          }}
          onMeaningSelect={selectMeaning}
          onMeaningAdded={handleMeaningAdded}
          onMediaClick={openCompareModal}
          onMemoEdit={startEditMemo}
          onRetry={() => userId && loadFlashcards(userId)}
        />
      )}

      {/* メモ編集モーダル */}
      <MemoModal
        isOpen={memoModalOpen}
        onOpenChange={setMemoModalOpen}
        flashcard={currentEditingFlashcard || null}
        memoText={memoText}
        onMemoTextChange={setMemoText}
        onSave={handleUpdateMemo}
        onCancel={closeMemoModal}
      />

      {/* メディア作成モーダル */}
      <MediaCreateModal
        isOpen={mediaModalOpen}
        onOpenChange={setMediaModalOpen}
        flashcard={currentMediaFlashcard}
        selectedMeaning={
          currentMediaFlashcard
            ? getSelectedMeaning(currentMediaFlashcard)
            : null
        }
        selectedMeanings={selectedMeanings}
        templates={templates}
        isLoading={isTemplatesLoading}
        error={templatesError}
        onTemplatesRetry={() => loadTemplates()}
        onMeaningSelect={(meaningId) =>
          selectMeaningInModal(meaningId, currentMediaFlashcard)
        }
      />

      {/* 比較モーダル */}
      <ComparisonUpdateModal
        isOpen={compareModalOpen}
        onOpenChange={setCompareModalOpen}
        flashcard={currentCompareFlashcard}
        selectedMeaning={
          currentCompareFlashcard
            ? getSelectedMeaning(currentCompareFlashcard)
            : null
        }
        onMeaningSelect={(meaningId) =>
          selectMeaningInModal(meaningId, currentCompareFlashcard)
        }
        onComparisonSubmitted={handleComparisonSubmitted}
      />

      {/* プロフィール更新モーダル */}
      <UserUpdateModal
        isOpen={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        currentUserName={displayUserName || ""}
        currentEmail={userEmail || ""}
        userId={userId || ""}
        onProfileUpdated={handleProfileUpdated}
      />
    </DashboardLayout>
  );
}
