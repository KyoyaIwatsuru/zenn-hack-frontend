import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleUserRound, Check, AlertCircle, Loader2 } from "lucide-react";
import { ModalLayout } from "@/components/layout";
import { useUserProfile } from "@/hooks";

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
  const [hasChanges, setHasChanges] = useState(false);

  // useUserProfile hookを使用
  const {
    isUpdating,
    error,
    updateSuccess,
    updateProfile,
    validateUserName,
    resetState,
  } = useUserProfile();

  // プロップスの変更を反映
  useEffect(() => {
    setUserName(currentUserName);
    setHasChanges(false);
    resetState();
  }, [currentUserName, isOpen, resetState]);

  // 変更検知
  useEffect(() => {
    setHasChanges(
      userName.trim() !== currentUserName && userName.trim().length > 0
    );
  }, [userName, currentUserName]);

  const handleSave = async () => {
    const trimmedUserName = userName.trim();
    const validationError = validateUserName(trimmedUserName);

    if (validationError) {
      return;
    }

    const success = await updateProfile(
      userId,
      trimmedUserName,
      currentEmail,
      onProfileUpdated
    );

    if (success) {
      // 1.5秒後にモーダルを閉じる
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    }
  };

  const handleCancel = () => {
    if (updateSuccess) {
      // 成功後はそのまま閉じる
      onOpenChange(false);
      return;
    }

    if (hasChanges && !isUpdating) {
      // 変更がある場合は確認
      if (confirm("変更を破棄してよろしいですか？")) {
        setUserName(currentUserName);
        setHasChanges(false);
        resetState();
        onOpenChange(false);
      }
    } else {
      setUserName(currentUserName);
      setHasChanges(false);
      resetState();
      onOpenChange(false);
    }
  };

  const titleContent = (
    <div className="flex items-center gap-2">
      {isUpdating ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : updateSuccess ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <CircleUserRound className="size-5" />
      )}
      {updateSuccess ? "プロフィールを更新しました" : "プロフィール編集"}
    </div>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={titleContent}
      titleClassName="text-custom flex items-center"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-custom text-sm font-medium">ユーザー名</label>
          <div className="relative">
            <Input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="ユーザー名を入力"
              maxLength={50}
              className={`focus:border-main border-gray-200 pr-10 transition-all duration-200 ${
                isUpdating ? "border-blue-300 bg-blue-50" : ""
              } ${updateSuccess ? "border-green-300 bg-green-50" : ""}`}
              disabled={isUpdating || updateSuccess}
            />
            {isUpdating && (
              <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform animate-spin text-blue-500" />
            )}
            {updateSuccess && (
              <Check className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-green-500" />
            )}
          </div>
          <div className="flex justify-between text-xs">
            <span
              className={`transition-colors ${
                userName.length > 45
                  ? "text-amber-600"
                  : userName.length > 40
                    ? "text-gray-600"
                    : "text-gray-500"
              }`}
            >
              {userName.length}/50文字
            </span>
            {hasChanges && (
              <span className="font-medium text-blue-600">
                未保存の変更あり
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-custom text-sm font-medium">
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

        {updateSuccess && (
          <Alert className="animate-in fade-in-0 border-green-200 bg-green-50 duration-500">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="font-medium text-green-700">
              プロフィールが正常に更新されました。
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="animate-in fade-in-0 border-red-200 bg-red-50 duration-500">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isUpdating}
            className={`text-custom border-gray-200 transition-all duration-200 hover:bg-gray-50 ${
              updateSuccess ? "opacity-50" : ""
            }`}
          >
            {updateSuccess ? "閉じる" : "キャンセル"}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isUpdating || !hasChanges || updateSuccess}
            className={`transition-all duration-200 ${
              updateSuccess
                ? "bg-green-600 text-white hover:bg-green-600"
                : "bg-main hover:bg-main/90 text-white"
            }`}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                更新中...
              </>
            ) : updateSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                更新完了
              </>
            ) : (
              "保存"
            )}
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}
