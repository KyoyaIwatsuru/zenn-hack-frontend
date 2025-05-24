type pos =
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

type Word = {
  wordId: string;
  word: string;
  coreMeaning: string;
  explanation: string;
};

type Meaning = {
  meaningId: string;
  pos: pos;
  translation: string;
  pronunciation: string;
  exampleEng: string;
  exampleJpn: string;
};

type Media = {
  mediaId: string;
  meaningId: string;
  mediaUrls: string[];
};

export type Flashcard = {
  flashcardId: string;
  word: Word;
  meanings: Meaning[];
  media: Media;
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
