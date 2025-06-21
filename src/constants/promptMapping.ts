export const QUESTION_TYPE_MAPPING = {
  taste: "画風",
  style: "スタイル",
  mood: "雰囲気",
  character: "登場キャラ",
  setting: "情景",
  time: "時代設定",
  other: "その他",
} as const;

// UI表示用の質問形式ラベル
export const QUESTION_LABELS = {
  taste: "どんなテイスト？",
  style: "どんなスタイル？",
  mood: "どんな雰囲気？",
  character: "登場人物は？",
  setting: "どんな場所？",
  time: "いつの時代？",
  other: "その他の指定は？",
} as const;

export type QuestionType = keyof typeof QUESTION_TYPE_MAPPING;

export const BASE_TEMPLATE = `あなたは画像生成AIを用いて画像を生成するプロンプトエンジニアです。
以下で指示する画像をAIで生成するためのプロンプトを英語で出力してください。
### 良いプロンプトの書き方のコツ
Style, Subject, Context and Backgroundから成り、意味のあるキーワードと修飾子を使用したシンプルかつ明確な文。
（例）A sketch of a modern apartment building surrounded by skyscrapers

# 画像の指示 
- 以下の{pos}の英単語「{word}」に関する例文の内容を適切に表現した画像。
## 例文
{example}`;

// QuestionModeで使用可能な質問タイプのリスト
export const AVAILABLE_QUESTION_TYPES: {
  value: QuestionType;
  label: string;
}[] = [
  { value: "taste", label: QUESTION_LABELS.taste },
  { value: "style", label: QUESTION_LABELS.style },
  { value: "mood", label: QUESTION_LABELS.mood },
  { value: "character", label: QUESTION_LABELS.character },
  { value: "setting", label: QUESTION_LABELS.setting },
  { value: "time", label: QUESTION_LABELS.time },
  { value: "other", label: QUESTION_LABELS.other },
];
