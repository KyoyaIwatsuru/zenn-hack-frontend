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
  GENERAL: {
    ALL_FIELDS_REQUIRED: "すべての項目を入力してください",
  },
} as const;