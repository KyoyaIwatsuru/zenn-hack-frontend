export const API_ENDPOINTS = {
  // User endpoints
  USER: {
    SETUP: "/api/user/setup",
    UPDATE: "/api/user/update",
  },
  
  // Flashcard endpoints
  FLASHCARD: {
    GET: (userId: string) => `/api/flashcard/${userId}`,
    UPDATE_CHECK_FLAG: "/api/flashcard/update/checkFlag",
    UPDATE_MEMO: "/api/flashcard/update/memo",
    UPDATE_MEANINGS: "/api/flashcard/update/usingMeaningIdList",
  },
  
  // Media endpoints
  MEDIA: {
    CREATE: "/api/media/create",
  },
  
  // Comparison endpoints
  COMPARISON: {
    GET: (userId: string) => `/api/comparison/${userId}`,
    UPDATE: "/api/comparison/update",
  },
  
  // Meaning endpoints
  MEANING: {
    GET: (wordId: string) => `/api/meaning/${wordId}`,
  },
  
  // Template endpoints
  TEMPLATE: {
    GET_ALL: "/api/template",
  },
} as const;

export const DEFAULT_VALUES = {
  TEMPLATE_ID: "default-template",
  COMPARISON_ID_PREFIX: "comparison_",
  MEDIA_ID_PREFIX: "media_",
} as const;