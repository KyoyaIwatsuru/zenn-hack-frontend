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

export type GenerationType =
  | "text-to-image"
  | "image-to-image"
  | "text-to-video"
  | "image-to-video";

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
  meaningId: string | null;
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

export type Comparison = {
  comparisonId: string;
  flashcardId: string;
  newMediaId: string;
  newMediaUrls: string[];
};

export type Template = {
  templateId: string;
  generationType: GenerationType;
  target: string;
  preText: string;
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
  usingMeaningIdList: string[];
};

export type MediaCreateRequest = {
  flashcardId: string;
  oldMediaId: string;
  meaningId: string | null;
  pos: pos;
  word: string;
  translation: string;
  exampleJpn: string;
  explanation: string;
  coreMeaning: string | null;
  generationType: GenerationType;
  templateId: string;
  userPrompt: string;
  otherSettings: string[] | null;
  allowGeneratingPerson: boolean;
  inputMediaUrls: string[] | null;
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

// Specific response data types
export type FlashcardData = {
  flashcards: Flashcard[];
};

export type MediaCreateData = {
  comparisonId: string;
  newMediaId: string;
  newMediaUrls: string[];
};

export type ComparisonData = {
  comparisons: Comparison[];
};

export type MeaningData = {
  meanings: Meaning[];
};

export type TemplateData = {
  templates: Template[];
};
