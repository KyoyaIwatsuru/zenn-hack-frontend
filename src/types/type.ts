export type pos =
  | "noun"
  | "pronoun"
  | "intransitiveVerb"
  | "transitiveVerb"
  | "adjective"
  | "adverb"
  | "auxiliaryVerb"
  | "preposition"
  | "article"
  | "interjection"
  | "conjunction"
  | "idiom";

export type User = {
  userId: string;
  userName: string;
  email: string;
};

export type Word = {
  wordId: string;
  word: string;
  coreMeaning: string;
  explanation: string;
};

export type Meaning = {
  meaningId: string;
  pos: pos;
  translation: string;
  pronunciation: string;
  exampleEng: string;
  exampleJpn: string;
};

export type Media = {
  mediaId: string;
  meaningId: string;
  mediaUrls: string[];
};

export type Flashcard = {
  flashcardId: string;
  word: Word;
  meanings: Meaning[];
  media: Media;
  version: number;
  memo: string;
  checkFlag: boolean;
};

export type Template = {
  templateId: string;
  name: string;
  description: string;
  generationType: string;
  promptText: string;
};

// API Request/Response types
export type CheckFlagUpdateRequest = {
  flashcardId: string;
  checkFlag: boolean;
};

export type MemoUpdateRequest = {
  flashcardId: string;
  memo: string;
};

export type UsingMeaningListUpdateRequest = {
  flashcardId: string;
  usingMeaningList: string[];
};

export type MediaCreateRequest = {
  flashcardId: string;
  oldMediaId: string;
  meaningId: string;
  generationType: string;
  templateId: string;
  userPrompt: string;
  allowGeneratingPerson: boolean;
  inputMediaUrls?: string[];
};

export type ComparisonUpdateRequest = {
  flashcardId: string;
  comparisonId: string;
  oldMediaId: string;
  newMediaId: string;
  isSelectedNew: boolean;
};

// Base API Response types
export type BaseApiResponse = {
  message: string;
};

export type ApiError = {
  detail: {
    loc: string[];
    msg: string;
    type: string;
  }[];
};

// API Response types
export type ApiResponse = BaseApiResponse | ApiError;

export type FlashcardResponse =
  | (BaseApiResponse & {
      flashcards: Flashcard[];
    })
  | ApiError;

export type MediaCreateResponse =
  | (BaseApiResponse & {
      newMediaId: string;
    })
  | ApiError;

export type ComparisonResponse =
  | (BaseApiResponse & {
      comparisonId: string;
      flashcardId: string;
      newMediaUrls: string[];
    })
  | ApiError;

export type MeaningResponse =
  | (BaseApiResponse & {
      meanings: Meaning[];
    })
  | ApiError;

export type TemplateResponse =
  | (BaseApiResponse & {
      template: Template[];
    })
  | ApiError;
