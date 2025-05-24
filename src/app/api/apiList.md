# API一覧

## フラッシュカードAPI

- **URL**: `/flashcard/{userId}`
- **メソッド**: `GET`
- **説明**: ユーザーのフラッシュカードを全て取得します。
- **パラメータ**:
  - `userId`: ユーザーID (必須)
- **レスポンス**:
  - `200 OK`: フラッシュカードの取得に成功
    - `コンテンツ`:
      - `flashcard`: flashcard[]
        - `flashcardId`: string
        - `word`: Word
          - `wordId`: string
          - `word`: string
          - `coreMeaning`: string
          - `explanation`: string
        - `meaning`: Meaning[]
          - `meaningId`: string
          - `pos`: string
          - `translation`: string
          - `pronunciation`: string
          - `exampleEng`: string
          - `exampleJpn`: string
        - `media`: Media
          - `mediaId`: string
          - `meaningId`: string
          - `mediaUrls`: string[]
        - `version`: number
        - `memo`: string
        - `checkFlag`: boolean

## checkFlagAPI
- **URL**: `/flashcard/checkFlag`
- **メソッド**: `PUT`
- **説明**: フラッシュカードのチェックフラグを更新します。
- **リクエストボディ**:
  - `flashcardId`: string (必須)
  - `checkFlag`: boolean (必須)
- **レスポンス**:
  - `200 OK`: フラッシュカードのチェックフラグの更新に成功

## 意味取得API
- **URL**: `/flashcard/{wordId}`
- **メソッド**: `GET`
- **説明**: 単語のすべての意味を取得します。
- **パラメータ**:
  - `wordId`: 単語ID (必須)
- **レスポンス**:
  - `200 OK`: 単語の意味の取得に成功
    - `コンテンツ`:
      - `meaning`: Meaning[]
        - `meaningId`: string
        - `pos`: string
        - `translation`: string
        - `pronunciation`: string
        - `exampleEng`: string
        - `exampleJpn`: string

## 意味追加API
- **URL**: `/flashcard/meaning`
- **メソッド**: `PUT`
- **説明**: フラッシュカードに意味を追加します。
- **リクエストボディ**:
  - `flashcardId`: string (必須)
  - `meaning`: Meaning[] (必須)
    - `meaningId`: string
    - `pos`: string
    - `translation`: string
    - `pronunciation`: string
    - `exampleEng`: string
    - `exampleJpn`: string
- **レスポンス**:
  - `200 OK`: フラッシュカードの意味の追加に成功

## メモ更新API
- **URL**: `/flashcard/memo`
- **メソッド**: `PUT`
- **説明**: フラッシュカードのメモを更新します。
- **リクエストボディ**:
  - `flashcardId`: string (必須)
  - `memo`: string (必須)
- **レスポンス**:
  - `200 OK`: フラッシュカードのメモの更新に成功

## テンプレートAPI
- **URL**: `/template`
- **メソッド**: `GET`
- **説明**: 全てのテンプレートを取得します。
- **レスポンス**:
  - `200 OK`: テンプレートの取得に成功
    - `コンテンツ`:
      - `template`: template[]
        - `templateId`: string
        - `name`: string
        - `description`: string
        - `generationType`: string
        - `promptText`: string

## メディアAPI
- **URL**: `/media`
- **メソッド**: `POST`
- **説明**: メディアを生成します。
- **リクエストボディ**:
  - `userId`: string (必須)
  - `flashcardId`: string (必須)
  - `meaningId`: string (必須)
  - `generationType`: string (必須)
  - `templateId`: string (必須)
  - `userPrompt`: string (必須)
  - `inputMediaUrls`: string[]
- **レスポンス**:
  - `200 OK`: メディアの生成に成功
    - `コンテンツ`:
      - `media`: Media
        - `mediaId`: string
        - `meaningId`: string
        - `mediaUrls`: string[]

## メディア比較API
- **URL**: `/comparison`
- **メソッド**: `POST`
- **説明**: メディアを比較します。
- **リクエストボディ**:
  - `comparisonId`: string (必須)
  - `oldMediaId`: string (必須)
  - `newMediaId`: string (必須)
  - `selected`: string (必須)
- **レスポンス**:
  - `200 OK`: メディアの比較に成功
