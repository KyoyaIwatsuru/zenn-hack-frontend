import { backendClient, ApiResponse } from "@/lib/httpClient";
import { ErrorHandler } from "@/lib/errorHandler";
import { MEDIA_API_CONFIG } from "@/constants";
import {
  User,
  CheckFlagUpdateRequest,
  MemoUpdateRequest,
  UsingMeaningListUpdateRequest,
  MediaCreateRequest,
  ComparisonUpdateRequest,
  FlashcardCreateRequest,
  UsingFlashcardAddRequest,
  BaseApiResponse,
  FlashcardData,
  MediaCreateData,
  ComparisonData,
  MeaningData,
  TemplateData,
  WordSearchResponse,
  FlashcardCreateResponse,
} from "@/types";

// APIレスポンス処理のヘルパー関数
const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.success) {
    return response.data;
  } else {
    ErrorHandler.logError(response.error);
    throw new Error(ErrorHandler.getUserFriendlyMessage(response.error));
  }
};

export const apiService = {
  // ユーザー登録
  setupUser: async (data: User): Promise<BaseApiResponse> => {
    const response = await backendClient.post<BaseApiResponse>(
      "/user/setup",
      data
    );
    return handleApiResponse(response);
  },

  // ユーザー情報更新
  updateUser: async (data: User): Promise<BaseApiResponse> => {
    const response = await backendClient.put<BaseApiResponse>(
      "/user/update",
      data
    );
    return handleApiResponse(response);
  },

  // フラッシュカード追加
  addUsingFlashcard: async (
    data: UsingFlashcardAddRequest
  ): Promise<BaseApiResponse> => {
    const response = await backendClient.put<BaseApiResponse>(
      "/user/add/usingFlashcard",
      data
    );
    return handleApiResponse(response);
  },

  // フラッシュカード取得
  getFlashcards: async (userId: string): Promise<FlashcardData> => {
    const response = await backendClient.get<FlashcardData>(
      `/flashcard/${userId}`
    );
    return handleApiResponse(response);
  },

  // デフォルトフラッシュカード作成
  createFlashcard: async (
    data: FlashcardCreateRequest
  ): Promise<FlashcardCreateResponse> => {
    const response = await backendClient.post<FlashcardCreateResponse>(
      "/flashcard/create",
      data
    );
    return handleApiResponse(response);
  },

  // チェックフラグ更新
  updateCheckFlag: async (
    data: CheckFlagUpdateRequest
  ): Promise<BaseApiResponse> => {
    const response = await backendClient.put<BaseApiResponse>(
      "/flashcard/update/checkFlag",
      data
    );
    return handleApiResponse(response);
  },

  // メモ更新
  updateMemo: async (data: MemoUpdateRequest): Promise<BaseApiResponse> => {
    const response = await backendClient.put<BaseApiResponse>(
      "/flashcard/update/memo",
      data
    );
    return handleApiResponse(response);
  },

  // 意味更新
  updateMeaning: async (
    data: UsingMeaningListUpdateRequest
  ): Promise<BaseApiResponse> => {
    const response = await backendClient.put<BaseApiResponse>(
      "/flashcard/update/usingMeaningIdList",
      data
    );
    return handleApiResponse(response);
  },

  // メディア生成
  createMedia: async (data: MediaCreateRequest): Promise<MediaCreateData> => {
    const response = await backendClient.post<MediaCreateData>(
      "/media/create",
      data,
      {
        timeout: MEDIA_API_CONFIG.TIMEOUT, // AI画像生成のため120秒
        retries: MEDIA_API_CONFIG.RETRIES, // リトライ回数を減らす
      }
    );
    return handleApiResponse(response);
  },

  // 比較取得
  getComparison: async (userId: string): Promise<ComparisonData> => {
    const response = await backendClient.get<ComparisonData>(
      `/comparison/${userId}`
    );
    return handleApiResponse(response);
  },

  // 比較更新
  updateCompare: async (
    data: ComparisonUpdateRequest
  ): Promise<BaseApiResponse> => {
    const response = await backendClient.put<BaseApiResponse>(
      "/comparison/update",
      data
    );
    return handleApiResponse(response);
  },

  // 単語の意味取得
  getMeanings: async (wordId: string): Promise<MeaningData> => {
    const response = await backendClient.get<MeaningData>(`/meaning/${wordId}`);
    return handleApiResponse(response);
  },

  // テンプレート取得
  getTemplates: async (): Promise<TemplateData> => {
    const response = await backendClient.get<TemplateData>("/template");
    return handleApiResponse(response);
  },

  // 単語情報取得
  getWordInfo: async (word: string): Promise<WordSearchResponse> => {
    const response = await backendClient.get<WordSearchResponse>(
      `/word/${word}`
    );
    return handleApiResponse(response);
  },
};
