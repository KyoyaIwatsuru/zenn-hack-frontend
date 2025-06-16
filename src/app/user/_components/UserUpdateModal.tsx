import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Check, AlertCircle, Loader2 } from "lucide-react";

interface UserUpdateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserName: string;
  currentEmail: string;
  userId: string;
  onProfileUpdated: (newUserName: string) => void;
}

export function UserUpdateModal({
  isOpen,
  onOpenChange,
  currentUserName,
  currentEmail,
  userId,
  onProfileUpdated,
}: UserUpdateModalProps) {
  const [userName, setUserName] = useState(currentUserName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOptimisticUpdate, setIsOptimisticUpdate] = useState(false);

  // プロップスの変更を反映
  useEffect(() => {
    setUserName(currentUserName);
    setHasChanges(false);
    setError("");
    setSuccess(false);
    setIsOptimisticUpdate(false);
  }, [currentUserName, isOpen]);

  // 変更検知
  useEffect(() => {
    setHasChanges(userName.trim() !== currentUserName && userName.trim().length > 0);
  }, [userName, currentUserName]);

  const validateUserName = (name: string): string | null => {
    if (!name.trim()) {
      return "ユーザー名は必須です";
    }
    if (name.trim().length > 50) {
      return "ユーザー名は50文字以内で入力してください";
    }
    return null;
  };

  const handleSave = async () => {
    const trimmedUserName = userName.trim();
    const validationError = validateUserName(trimmedUserName);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    // 段階1: 楽観的更新 - UI即座反映
    const originalName = currentUserName;
    setIsOptimisticUpdate(true);
    onProfileUpdated(trimmedUserName);

    try {
      // 段階2: Firebase updateProfile
      const { firebaseAuth } = await import("@/lib/auth");
      const { updateProfile } = await import("firebase/auth");
      
      if (firebaseAuth.currentUser) {
        await updateProfile(firebaseAuth.currentUser, {
          displayName: trimmedUserName,
        });
      }

      // 段階3: FastAPI updateUser
      const { apiService } = await import("@/services/apiService");
      await apiService.updateUser({
        userId: userId,
        userName: trimmedUserName,
        email: currentEmail,
      });

      // 段階4: 成功フィードバック
      setIsOptimisticUpdate(false);
      setSuccess(true);
      
      // 1.5秒後にモーダルを閉じる
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
      
    } catch (err) {
      // エラー時ロールバック
      setIsOptimisticUpdate(false);
      onProfileUpdated(originalName);
      
      // 詳細なエラーメッセージ
      let errorMessage = "プロフィールの更新に失敗しました。";
      if (err instanceof Error) {
        if (err.message.includes("Firebase")) {
          errorMessage = "Firebase認証の更新に失敗しました。再試行してください。";
        } else if (err.message.includes("Network")) {
          errorMessage = "ネットワークエラーが発生しました。接続を確認して再試行してください。";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (success) {
      // 成功後はそのまま閉じる
      onOpenChange(false);
      return;
    }
    
    if (hasChanges && !isLoading) {
      // 変更がある場合は確認
      if (confirm("変更を破棄してよろしいですか？")) {
        setUserName(currentUserName);
        setError("");
        setSuccess(false);
        setHasChanges(false);
        setIsOptimisticUpdate(false);
        onOpenChange(false);
      }
    } else {
      setUserName(currentUserName);
      setError("");
      setSuccess(false);
      setHasChanges(false);
      setIsOptimisticUpdate(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-custom flex items-center gap-2">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : success ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <User className="w-5 h-5" />
            )}
            {success ? "プロフィールを更新しました" : "プロフィール編集"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-custom">
              ユーザー名
            </label>
            <div className="relative">
              <Input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="ユーザー名を入力"
                maxLength={50}
                className={`border-gray-200 focus:border-main pr-10 transition-all duration-200 ${
                  isOptimisticUpdate ? "bg-blue-50 border-blue-300" : ""
                } ${
                  success ? "bg-green-50 border-green-300" : ""
                }`}
                disabled={isLoading || success}
              />
              {isOptimisticUpdate && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
              )}
              {success && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span className={`transition-colors ${
                userName.length > 45 ? "text-amber-600" : 
                userName.length > 40 ? "text-gray-600" : "text-gray-500"
              }`}>
                {userName.length}/50文字
              </span>
              {hasChanges && (
                <span className="text-blue-600 font-medium">
                  未保存の変更あり
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-custom">
              メールアドレス
            </label>
            <Input
              type="email"
              value={currentEmail}
              disabled={true}
              className="border-gray-200 bg-gray-50 text-gray-500"
            />
            <div className="text-xs text-gray-500">
              メールアドレスは変更できません
            </div>
          </div>

          {success && (
            <Alert className="border-green-200 bg-green-50 animate-in fade-in-0 duration-500">
              <Check className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-700 font-medium">
                プロフィールが正常に更新されました。
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50 animate-in fade-in-0 duration-500">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
              className={`border-gray-200 text-custom hover:bg-gray-50 transition-all duration-200 ${
                success ? "opacity-50" : ""
              }`}
            >
              {success ? "閉じる" : "キャンセル"}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading || !hasChanges || success}
              className={`transition-all duration-200 ${
                success 
                  ? "bg-green-600 hover:bg-green-600 text-white" 
                  : "bg-main hover:bg-main/90 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  更新中...
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  更新完了
                </>
              ) : (
                "保存"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}