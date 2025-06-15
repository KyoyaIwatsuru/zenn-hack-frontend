import { apiClient } from "@/lib/apiClient";
import {
  User,
  CheckFlagUpdateRequest,
  MemoUpdateRequest,
  UsingMeaningListUpdateRequest,
  MediaCreateRequest,
  ComparisonUpdateRequest,
  ApiResponse,
  FlashcardResponse,
  MediaCreateResponse,
  ComparisonResponse,
  MeaningResponse,
  TemplateResponse,
} from "@/types/type";

export const apiService = {
  // ユーザー登録
  setupUser: async (data: User): Promise<ApiResponse> => {
    const response = (await apiClient("/user/setup", {
      method: "POST",
      body: JSON.stringify(data),
    })) as ApiResponse;
    if ("message" in response) {
      return response;
    } else {
      throw new Error(
        response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
      );
    }
  },

  // ユーザー情報更新
  updateUser: async (data: User): Promise<ApiResponse> => {
    const response = (await apiClient("/user/update", {
      method: "PUT",
      body: JSON.stringify(data),
    })) as ApiResponse;
    if ("message" in response) {
      return response;
    } else {
      throw new Error(
        response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
      );
    }
  },

  // フラッシュカード取得
  getFlashcards: async (userId: string): Promise<FlashcardResponse> => {
    const response = (await apiClient(
      `/flashcard/${userId}`
    )) as FlashcardResponse;
    if ("flashcards" in response) {
      return response;
    }
    throw new Error(
      response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
    );
  },

  // チェックフラグ更新
  updateCheckFlag: async (
    data: CheckFlagUpdateRequest
  ): Promise<ApiResponse> => {
    const response = (await apiClient("/flashcard/update/checkFlag", {
      method: "PUT",
      body: JSON.stringify(data),
    })) as ApiResponse;
    if ("message" in response) {
      return response;
    } else {
      throw new Error(
        response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
      );
    }
  },

  // メモ更新
  updateMemo: async (data: MemoUpdateRequest): Promise<ApiResponse> => {
    const response = (await apiClient("/flashcard/update/memo", {
      method: "PUT",
      body: JSON.stringify(data),
    })) as ApiResponse;
    if ("message" in response) {
      return response;
    } else {
      throw new Error(
        response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
      );
    }
  },

  // 意味更新
  updateMeaning: async (
    data: UsingMeaningListUpdateRequest
  ): Promise<ApiResponse> => {
    const response = (await apiClient("/flashcard/update/usingMeaningIdList", {
      method: "PUT",
      body: JSON.stringify(data),
    })) as ApiResponse;
    if ("message" in response) {
      return response;
    } else {
      throw new Error(
        response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
      );
    }
  },

  // メディア生成
  createMedia: async (
    data: MediaCreateRequest
  ): Promise<MediaCreateResponse> => {
    const response = (await apiClient("/media/create", {
      method: "POST",
      body: JSON.stringify(data),
    })) as MediaCreateResponse;
    if ("newMediaId" in response) {
      return response;
    } else {
      throw new Error(
        response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
      );
    }
  },

  // 比較取得
  getComparison: async (userId: string): Promise<ComparisonResponse> => {
    const response = (await apiClient(
      `/comparison/${userId}`
    )) as ComparisonResponse;
    if ("comparisonId" in response) {
      return response;
    } else {
      throw new Error(
        response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
      );
    }
  },

  // 比較更新
  updateCompare: async (
    data: ComparisonUpdateRequest
  ): Promise<ApiResponse> => {
    const response = (await apiClient("/comparison/update", {
      method: "POST",
      body: JSON.stringify(data),
    })) as ApiResponse;
    if ("message" in response) {
      return response;
    } else {
      throw new Error(
        response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
      );
    }
  },

  // 単語の意味取得
  getMeanings: async (wordId: string): Promise<MeaningResponse> => {
    const response = (await apiClient(`/meaning/${wordId}`)) as MeaningResponse;
    if ("meanings" in response) {
      return response;
    } else {
      throw new Error(
        response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
      );
    }
  },

  // テンプレート取得
  getTemplates: async (): Promise<TemplateResponse> => {
    const response = (await apiClient("/template")) as TemplateResponse;
    if ("template" in response) {
      return response;
    } else {
      throw new Error(
        response.detail.map((d) => `${d.loc.join(".")}: ${d.msg}`).join(", ")
      );
    }
  },
};
