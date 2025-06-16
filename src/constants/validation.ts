export const VALIDATION_RULES = {
  USER_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
  },
  MEMO: {
    MAX_LENGTH: 1000,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  FLASHCARD_ID: {
    MIN_LENGTH: 1,
  },
} as const;

export const VALIDATION_MESSAGES = {
  USER_NAME: {
    REQUIRED: "ユーザー名は必須です",
    TOO_LONG: "ユーザー名は50文字以内で入力してください",
  },
  PASSWORD: {
    REQUIRED: "パスワードは必須です",
    TOO_SHORT: "パスワードは6文字以上で入力してください",
    MISMATCH: "パスワードが一致しません",
  },
  EMAIL: {
    REQUIRED: "メールアドレスは必須です",
    INVALID: "有効なメールアドレスを入力してください",
  },
  MEMO: {
    TOO_LONG: "メモは1000文字以内で入力してください",
  },
  FLASHCARD_ID: {
    REQUIRED: "フラッシュカードIDは必須です",
  },
  GENERAL: {
    ALL_FIELDS_REQUIRED: "すべての項目を入力してください",
  },
} as const;

// バリデーション結果の型定義
export type ValidationResult = 
  | { valid: true }
  | { valid: false; error: string };

// バリデーション関数
export const validators = {
  // ユーザー名バリデーション
  userName: (value: string): ValidationResult => {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return { valid: false, error: VALIDATION_MESSAGES.USER_NAME.REQUIRED };
    }
    
    if (trimmed.length > VALIDATION_RULES.USER_NAME.MAX_LENGTH) {
      return { valid: false, error: VALIDATION_MESSAGES.USER_NAME.TOO_LONG };
    }
    
    return { valid: true };
  },
} as const;