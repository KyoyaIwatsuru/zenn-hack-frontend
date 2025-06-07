import { apiClient } from "@/lib/apiClient";
import {
  Flashcard,
  Meaning,
  Template,
  Media,
  CheckFlagRequest,
  MeaningAddRequest,
  MemoUpdateRequest,
  MediaGenerateRequest,
  MediaCompareRequest,
  FlashcardResponse,
  MeaningResponse,
  TemplateResponse,
  MediaResponse,
} from "@/types/type";

export const flashcardService = {
  // フラッシュカード取得
  getFlashcards: async (userId: string): Promise<Flashcard[]> => {
    const response = (await apiClient(
      `/flashcard/${userId}`
    )) as FlashcardResponse;
    return response.flashcard;
  },

  // チェックフラグ更新
  updateCheckFlag: async (data: CheckFlagRequest): Promise<void> => {
    await apiClient("/flashcard/checkFlag", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // 単語の意味取得
  getMeanings: async (wordId: string): Promise<Meaning[]> => {
    const response = (await apiClient(`/word/${wordId}`)) as MeaningResponse;
    return response.meaning;
  },

  // 意味追加
  addMeaning: async (data: MeaningAddRequest): Promise<void> => {
    await apiClient("/flashcard/meaning", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // メモ更新
  updateMemo: async (data: MemoUpdateRequest): Promise<void> => {
    await apiClient("/flashcard/memo", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // テンプレート取得
  getTemplates: async (): Promise<Template[]> => {
    const response = (await apiClient("/template")) as TemplateResponse;
    return response.template;
  },

  // メディア生成
  generateMedia: async (data: MediaGenerateRequest): Promise<Media> => {
    const response = (await apiClient("/media", {
      method: "POST",
      body: JSON.stringify(data),
    })) as MediaResponse;
    return response.media;
  },

  // メディア比較
  compareMedia: async (data: MediaCompareRequest): Promise<void> => {
    await apiClient("/comparison", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
