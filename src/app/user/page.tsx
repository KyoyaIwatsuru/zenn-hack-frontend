"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Flashcard, Meaning, Comparison } from "@/types";
import { MediaCreateResult } from "@/types/ui";
import {
  useFlashcards,
  useTemplates,
  useComparison,
  useFirebaseAuth,
} from "@/hooks";
import { DashboardLayout } from "@/components/layout";
import { UserHeader } from "./_components/UserHeader";
import { FlashcardList } from "./_components/FlashcardList";
import { GeneratedFlashcardList } from "./_components/GeneratedFlashcardList";
import { MemorizationFlashcardList } from "./_components/MemorizationFlashcardList";
import { MemoModal } from "./_components/MemoModal";
import { MediaCreateModal } from "./_components/MediaCreateModal";
import { ComparisonUpdateModal } from "./_components/ComparisonUpdateModal";
import { UserUpdateModal } from "./_components/UserUpdateModal";
import {
  VisibilityControlPanel,
  VisibilitySettings,
} from "./_components/VisibilityControlPanel";

export default function UserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    displayName: firebaseDisplayName,
    isInitialized: firebaseInitialized,
  } = useFirebaseAuth();
  const userId = session?.user?.id || null;
  const userEmail = session?.user?.email || null;

  // Prioritize Firebase Auth displayName over NextAuth session
  const [displayUserName, setDisplayUserName] = useState<string | null>(null);

  // フラッシュカード関連の状態とロジック
  const {
    flashcards,
    isLoading: isFlashcardsLoading,
    error: flashcardsError,
    loadFlashcards,
    updateCheckFlag,
    updateMemo,
    addMeanings,
    deleteMeanings,
  } = useFlashcards();

  // テンプレート関連の状態とロジック
  const {
    templates,
    isLoading: isTemplatesLoading,
    error: templatesError,
    loadTemplates,
  } = useTemplates();

  // 比較データ関連
  const { getComparisons } = useComparison();

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

  // 暗記モード用の表示設定管理
  const [memorizationVisibilitySettings, setMemorizationVisibilitySettings] =
    useState<VisibilitySettings>({
      word: true,
      image: true,
      meanings: true,
      examples: true,
      explanation: true,
    });

  // 暗記モード用の適用中フラグ管理
  const [isApplyingMemorizationSettings, setIsApplyingMemorizationSettings] =
    useState(false);
  const [appliedCardsCount, setAppliedCardsCount] = useState(0);

  // 暗記モード用の設定変更処理
  const handleMemorizationVisibilityChange = useCallback(
    (newSettings: VisibilitySettings) => {
      setMemorizationVisibilitySettings(newSettings);
      setIsApplyingMemorizationSettings(true);
      setAppliedCardsCount(0);
    },
    []
  );

  // メディア生成結果の状態管理
  const [mediaCreateResults, setMediaCreateResults] = useState<
    Record<string, MediaCreateResult>
  >({});

  // 永続化された比較データをmediaCreateResultsに統合
  const mergeComparisonData = useCallback((comparisons: Comparison[]) => {
    const converted = comparisons.reduce(
      (acc, comparison) => {
        acc[comparison.flashcardId] = {
          comparisonId: comparison.comparisonId,
          newMediaId: comparison.newMediaId,
          newMediaUrls: comparison.newMediaUrls,
          status: "success" as const,
        };
        return acc;
      },
      {} as Record<string, MediaCreateResult>
    );

    // 既存のmediaCreateResultsとマージ（新規データを優先）
    setMediaCreateResults((prev) => ({ ...converted, ...prev }));
  }, []);

  // 永続化された比較データを取得
  const loadPersistedComparisons = useCallback(
    async (userId: string) => {
      try {
        const comparisons = await getComparisons(userId);
        mergeComparisonData(comparisons);
      } catch (error) {
        console.error("Failed to load persisted comparisons:", error);
      }
    },
    [getComparisons, mergeComparisonData]
  );

  // displayUserNameを初期化
  useEffect(() => {
    if (firebaseInitialized) {
      if (firebaseDisplayName) {
        setDisplayUserName(firebaseDisplayName);
      } else if (session?.user?.name && !displayUserName) {
        const lastUpdatedUserName = localStorage.getItem("lastUpdatedUserNam");
        const updateTimestamp = localStorage.getItem("userNameUpdateTimestamp");
        const isRecentUpdate =
          updateTimestamp &&
          Date.now() - parseInt(updateTimestamp) < 24 * 60 * 60 * 1000;

        if (lastUpdatedUserName && isRecentUpdate) {
          setDisplayUserName(lastUpdatedUserName);
        } else {
          setDisplayUserName(session.user.name);
        }
      }
    } else if (
      session?.user?.name &&
      !displayUserName &&
      !firebaseInitialized
    ) {
      setDisplayUserName(session.user.name);
    }
  }, [
    firebaseDisplayName,
    firebaseInitialized,
    session?.user?.name,
    displayUserName,
  ]);

  useEffect(() => {
    if (
      firebaseInitialized &&
      firebaseDisplayName &&
      firebaseDisplayName !== displayUserName
    ) {
      setDisplayUserName(firebaseDisplayName);
    }
  }, [firebaseDisplayName, firebaseInitialized, displayUserName]);

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
      loadPersistedComparisons(userId);
    }
  }, [
    status,
    session,
    userId,
    router,
    loadFlashcards,
    loadTemplates,
    loadPersistedComparisons,
  ]);

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

  // 意味削除処理
  const handleMeaningDeleted = (
    flashcardId: string,
    deletedMeanings: Meaning[]
  ) => {
    deleteMeanings(flashcardId, deletedMeanings);
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

  // メディア生成成功時の処理
  const handleMediaCreateSuccess = (
    flashcardId: string,
    result: MediaCreateResult
  ) => {
    setMediaCreateResults((prev) => ({
      ...prev,
      [flashcardId]: result,
    }));
  };

  // 比較完了処理
  const handleComparisonComplete = (flashcardId: string) => {
    // MediaCreateData を削除
    setMediaCreateResults((prev) => {
      const newResults = { ...prev };
      delete newResults[flashcardId];
      return newResults;
    });

    // フラッシュカード再読み込み
    if (userId) {
      loadFlashcards(userId);
    }
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
          memorizationControlPanel={
            <VisibilityControlPanel
              visibilitySettings={memorizationVisibilitySettings}
              onVisibilityChange={handleMemorizationVisibilityChange}
              isApplying={isApplyingMemorizationSettings}
              appliedCardsCount={appliedCardsCount}
              totalCardsCount={flashcards.length}
            />
          }
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
          mediaCreateResults={mediaCreateResults}
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
          onMeaningDeleted={handleMeaningDeleted}
          onMediaClick={openMediaModal}
          onMemoEdit={startEditMemo}
          onRetry={() => userId && loadFlashcards(userId)}
        />
      ) : currentTab === "generated" ? (
        <GeneratedFlashcardList
          flashcards={flashcards}
          isLoading={isFlashcardsLoading}
          error={flashcardsError || ""}
          selectedMeanings={selectedMeanings}
          mediaCreateResults={mediaCreateResults}
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
          onMeaningDeleted={handleMeaningDeleted}
          onMediaClick={openCompareModal}
          onMemoEdit={startEditMemo}
          onRetry={() => userId && loadFlashcards(userId)}
        />
      ) : (
        <MemorizationFlashcardList
          flashcards={flashcards}
          isLoading={isFlashcardsLoading}
          error={flashcardsError || ""}
          selectedMeanings={selectedMeanings}
          globalVisibilitySettings={memorizationVisibilitySettings}
          isApplyingSettings={isApplyingMemorizationSettings}
          appliedCardsCount={appliedCardsCount}
          onCheckFlagToggle={(flashcardId) => {
            const flashcard = flashcards.find(
              (c) => c.flashcardId === flashcardId
            );
            if (flashcard) {
              updateCheckFlag(flashcardId, !flashcard.checkFlag);
            }
          }}
          onMemoEdit={startEditMemo}
          onRetry={() => userId && loadFlashcards(userId)}
          onSettingsApplied={() => setIsApplyingMemorizationSettings(false)}
          onAppliedCardsCountChange={setAppliedCardsCount}
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
        templates={templates}
        isLoading={isTemplatesLoading}
        error={templatesError}
        onTemplatesRetry={() => loadTemplates()}
        onMeaningSelect={(meaningId) =>
          selectMeaningInModal(meaningId, currentMediaFlashcard)
        }
        onMediaCreateSuccess={handleMediaCreateSuccess}
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
        mediaCreateResults={mediaCreateResults}
        onMeaningSelect={(meaningId) =>
          selectMeaningInModal(meaningId, currentCompareFlashcard)
        }
        onComparisonComplete={handleComparisonComplete}
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
