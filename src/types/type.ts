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
  meaning: Meaning[];
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

export type Comparison = {
  comparisonId: string;
  oldMediaId: string;
  newMediaId: string;
  selected: string;
};

// API Request/Response types
export type CheckFlagRequest = {
  flashcardId: string;
  checkFlag: boolean;
};

export type MeaningAddRequest = {
  flashcardId: string;
  meaning: Meaning[];
};

export type MemoUpdateRequest = {
  flashcardId: string;
  memo: string;
};

export type MediaGenerateRequest = {
  userId: string;
  flashcardId: string;
  meaningId: string;
  generationType: string;
  templateId: string;
  userPrompt: string;
  inputMediaUrls?: string[];
};

export type MediaCompareRequest = {
  comparisonId: string;
  oldMediaId: string;
  newMediaId: string;
  selected: string;
};

// API Response types
export type FlashcardResponse = {
  flashcard: Flashcard[];
};

export type MeaningResponse = {
  meaning: Meaning[];
};

export type TemplateResponse = {
  template: Template[];
};

export type MediaResponse = {
  media: Media;
};
