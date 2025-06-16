import { backendClient } from "@/lib/httpClient";
import { ErrorHandler } from "@/lib/errorHandler";
import {
  User,
  CheckFlagUpdateRequest,
  MemoUpdateRequest,
  UsingMeaningListUpdateRequest,
  MediaCreateRequest,
  ComparisonUpdateRequest,
} from "@/types";

export const apiService = {
  // ユーザー登録
  setupUser: async (data: User): Promise<{ message: string }> => {
    const response = await backendClient.post<{ message: string }>("/user/setup", data);
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },

  // ユーザー情報更新
  updateUser: async (data: User): Promise<{ message: string }> => {
    const response = await backendClient.put<{ message: string }>("/user/update", data);
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },

  // フラッシュカード取得
  getFlashcards: async (userId: string) => {
    const response = await backendClient.get(`/flashcard/${userId}`);
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },

  // チェックフラグ更新
  updateCheckFlag: async (
    data: CheckFlagUpdateRequest
  ): Promise<{ message: string }> => {
    const response = await backendClient.put<{ message: string }>("/flashcard/update/checkFlag", data);
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },

  // メモ更新
  updateMemo: async (data: MemoUpdateRequest): Promise<{ message: string }> => {
    const response = await backendClient.put<{ message: string }>("/flashcard/update/memo", data);
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },

  // 意味更新
  updateMeaning: async (
    data: UsingMeaningListUpdateRequest
  ): Promise<{ message: string }> => {
    const response = await backendClient.put<{ message: string }>("/flashcard/update/usingMeaningIdList", data);
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },

  // メディア生成
  createMedia: async (
    data: MediaCreateRequest
  ) => {
    const response = await backendClient.post("/media/create", data);
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },

  // 比較取得
  getComparison: async (userId: string) => {
    const response = await backendClient.get(`/comparison/${userId}`);
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },

  // 比較更新
  updateCompare: async (
    data: ComparisonUpdateRequest
  ): Promise<{ message: string }> => {
    const response = await backendClient.post<{ message: string }>("/comparison/update", data);
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },

  // 単語の意味取得
  getMeanings: async (wordId: string) => {
    const response = await backendClient.get(`/meaning/${wordId}`);
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },

  // テンプレート取得
  getTemplates: async () => {
    const response = await backendClient.get("/template");
    
    if (response.success && response.data) {
      return response.data;
    } else if (response.error) {
      ErrorHandler.logError(response.error);
      throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
    }
    
    throw new Error("Unknown error occurred");
  },
};
