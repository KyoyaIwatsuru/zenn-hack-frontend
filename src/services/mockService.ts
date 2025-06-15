import { Flashcard, Meaning, Template, Media } from "@/types/type";

// ダミーデータ
const mockFlashcards: Flashcard[] = [
  {
    flashcardId: "1",
    word: {
      wordId: "1",
      word: "account",
      coreMeaning: "報告、説明",
      explanation:
        "「count（数える）」という単語が語源に含まれていることから、数や出来事、問題を計算・説明するというイメージが生まれます。",
    },
    meanings: [
      {
        meaningId: "1",
        pos: "noun",
        translation: "報告、説明",
        pronunciation: "əkáunt",
        exampleEng: "She gave a brief account of the accident.",
        exampleJpn: "彼女はその事故について簡潔な説明をした。",
      },
      {
        meaningId: "2",
        pos: "transitiveVerb",
        translation: "をみなす",
        pronunciation: "əkáunt",
        exampleEng: "I account him a friend.",
        exampleJpn: "私は彼を友人とみなす。",
      },
    ],
    media: {
      mediaId: "1",
      meaningId: "1",
      mediaUrls: ["/placeholder-image.jpg"],
    },
    version: 1,
    memo: "",
    checkFlag: true,
  },
  {
    flashcardId: "2",
    word: {
      wordId: "2",
      word: "consider",
      coreMeaning: "考慮する、検討する",
      explanation:
        "「con（一緒に）」と「sider（座る）」が組み合わさった語源で、物事について座ってじっくり考えるというイメージです。",
    },
    meanings: [
      {
        meaningId: "3",
        pos: "transitiveVerb",
        translation: "考慮する",
        pronunciation: "kənsídər",
        exampleEng: "Please consider my proposal carefully.",
        exampleJpn: "私の提案を慎重に考慮してください。",
      },
      {
        meaningId: "4",
        pos: "transitiveVerb",
        translation: "をみなす",
        pronunciation: "kənsídər",
        exampleEng: "I consider him my best friend.",
        exampleJpn: "私は彼を親友だと思っている。",
      },
    ],
    media: {
      mediaId: "2",
      meaningId: "3",
      mediaUrls: ["/placeholder-image2.jpg"],
    },
    version: 1,
    memo: "ビジネスでよく使われる重要な動詞",
    checkFlag: false,
  },
  {
    flashcardId: "3",
    word: {
      wordId: "3",
      word: "demonstrate",
      coreMeaning: "実演する、証明する",
      explanation:
        "「de（完全に）」と「monstrare（見せる）」から成り立ち、何かを完全に見せる・示すという意味を持ちます。",
    },
    meanings: [
      {
        meaningId: "5",
        pos: "transitiveVerb",
        translation: "実演する",
        pronunciation: "démənstrèit",
        exampleEng: "The teacher demonstrated the experiment to students.",
        exampleJpn: "先生は学生たちに実験を実演した。",
      },
      {
        meaningId: "6",
        pos: "transitiveVerb",
        translation: "証明する",
        pronunciation: "démənstrèit",
        exampleEng: "The results demonstrate the effectiveness of the method.",
        exampleJpn: "結果はその方法の有効性を証明している。",
      },
    ],
    media: {
      mediaId: "3",
      meaningId: "5",
      mediaUrls: ["/placeholder-image3.jpg"],
    },
    version: 1,
    memo: "",
    checkFlag: false,
  },
];

// 各単語の追加可能な意味（現在フラッシュカードにない意味）
const additionalMeanings: Record<string, Meaning[]> = {
  "1": [
    // account の追加可能な意味
    {
      meaningId: "7",
      pos: "noun",
      translation: "口座",
      pronunciation: "əkáunt",
      exampleEng: "I opened a new bank account yesterday.",
      exampleJpn: "昨日新しい銀行口座を開設しました。",
    },
    {
      meaningId: "8",
      pos: "noun",
      translation: "重要性",
      pronunciation: "əkáunt",
      exampleEng: "Money is of little account to him.",
      exampleJpn: "彼にとってお金はあまり重要ではない。",
    },
  ],
  "2": [
    // consider の追加可能な意味
    {
      meaningId: "9",
      pos: "intransitiveVerb",
      translation: "熟考する",
      pronunciation: "kənsídər",
      exampleEng: "Take time to consider before making a decision.",
      exampleJpn: "決断を下す前に熟考する時間を取ってください。",
    },
  ],
  "3": [
    // demonstrate の追加可能な意味
    {
      meaningId: "10",
      pos: "intransitiveVerb",
      translation: "デモ行進する",
      pronunciation: "démənstrèit",
      exampleEng: "Students demonstrated against the new policy.",
      exampleJpn: "学生たちは新しい政策に反対してデモ行進した。",
    },
    {
      meaningId: "11",
      pos: "transitiveVerb",
      translation: "表示する",
      pronunciation: "démənstrèit",
      exampleEng: "The app demonstrates real-time data.",
      exampleJpn: "そのアプリはリアルタイムデータを表示する。",
    },
  ],
};

// ローカルストレージキー
const STORAGE_KEY = "flashcards_data_2";

// ローカルストレージからデータ取得
const getStoredData = (): Flashcard[] => {
  if (typeof window === "undefined") return mockFlashcards;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockFlashcards;
  } catch {
    return mockFlashcards;
  }
};

// ローカルストレージにデータ保存
const saveToStorage = (data: Flashcard[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

// 初回ロード時にダミーデータをセット
const initializeData = () => {
  if (typeof window === "undefined") return;

  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    saveToStorage(mockFlashcards);
  }
};

// モックAPIサービス
export const mockApiService = {
  // フラッシュカード取得
  getFlashcards: async (): Promise<Flashcard[]> => {
    // 初期化
    initializeData();

    // APIコールをシミュレート
    await new Promise((resolve) => setTimeout(resolve, 500));

    return getStoredData();
  },

  // チェックフラグ更新
  updateCheckFlag: async (data: {
    flashcardId: string;
    checkFlag: boolean;
  }): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const flashcards = getStoredData();
    const updatedFlashcards = flashcards.map((card) =>
      card.flashcardId === data.flashcardId
        ? { ...card, checkFlag: data.checkFlag }
        : card
    );

    saveToStorage(updatedFlashcards);
  },

  // メモ更新
  updateMemo: async (data: {
    flashcardId: string;
    memo: string;
  }): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const flashcards = getStoredData();
    const updatedFlashcards = flashcards.map((card) =>
      card.flashcardId === data.flashcardId
        ? { ...card, memo: data.memo }
        : card
    );

    saveToStorage(updatedFlashcards);
  },

  // 意味更新
  updateMeaning: async (data: {
    flashcardId: string;
    usingMeaningList: string[];
  }): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const flashcards = getStoredData();
    const updatedFlashcards = flashcards.map((card) =>
      card.flashcardId === data.flashcardId
        ? { ...card, meaning: [...card.meanings, ...data.usingMeaningList] }
        : card
    );

    saveToStorage(updatedFlashcards);
  },

  // メディア生成
  createMedia: async (data: {
    flashcardId: string;
    oldMediaId: string;
    meaningId: string;
    generationType: string;
    templateId: string;
    userPrompt: string;
    allowGeneratingPerson: boolean;
    inputMediaUrls?: string[];
  }): Promise<Media> => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 生成に時間がかかることをシミュレート

    // 生成された画像のダミーURL
    const generatedUrl = `/generated-image-${Date.now()}.jpg`;

    const newMedia: Media = {
      mediaId: `media_${Date.now()}`,
      meaningId: data.meaningId,
      mediaUrls: [generatedUrl],
    };

    // フラッシュカードのメディアを更新
    const flashcards = getStoredData();
    const updatedFlashcards = flashcards.map((card) =>
      card.flashcardId === data.flashcardId
        ? { ...card, media: newMedia }
        : card
    );

    saveToStorage(updatedFlashcards);

    return newMedia;
  },

  // 比較更新
  updateCompare: async (data: {
    flashcardId: string;
    comparisonId: string;
    oldMediaId: string;
    newMediaId: string;
    isSelectedNew: boolean;
  }): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 比較結果をログに記録（実際のAPIでは分析データとして送信）
    console.log("比較結果:", data);
  },

  // 単語の意味取得（追加可能な意味を含む）
  getMeanings: async (wordId: string): Promise<Meaning[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const flashcards = getStoredData();
    const flashcard = flashcards.find((f) => f.word.wordId === wordId);
    const currentMeanings = flashcard?.meanings || [];
    const additional = additionalMeanings[wordId] || [];

    return [...currentMeanings, ...additional];
  },

  // テンプレート取得
  getTemplates: async (): Promise<Template[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      {
        templateId: "1",
        name: "基本テンプレート",
        promptText: "Create a simple illustration representing: {meaning}",
        description: "",
        generationType: "",
      },
      {
        templateId: "2",
        name: "ビジネステンプレート",
        promptText: "Create a professional business scene showing: {meaning}",
        description: "",
        generationType: "",
      },
      {
        templateId: "3",
        name: "カジュアルテンプレート",
        promptText: "Create a casual, friendly illustration of: {meaning}",
        description: "",
        generationType: "",
      },
    ];
  },
};
