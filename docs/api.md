# API 一覧

## ユーザー登録 API

- **URL**: `/user/setup`
- **メソッド**: `POST`
- **説明**: ユーザーを登録します。
- **リクエストボディ**:
  - `User`: User
    - `userId`: string (必須)
    - `userName`: string (必須)
    - `email`: string (必須)
- **レスポンス**:
  - `200 OK`: ユーザー登録に成功
    - `コンテンツ`:
      - `message`: string
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## ユーザー情報更新 API

- **URL**: `/user/update`
- **メソッド**: `PUT`
- **説明**: ユーザー情報を更新します。
- **リクエストボディ**:
  - `User`: User
    - `userId`: string (必須)
    - `userName`: string (必須)
    - `email`: string (必須)
- **レスポンス**:
  - `200 OK`: ユーザー情報の更新に成功
    - `コンテンツ`:
      - `message`: string
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## フラッシュカード取得 API

- **URL**: `/flashcard/{userId}`
- **メソッド**: `GET`
- **説明**: ユーザーのフラッシュカードを全て取得します。
- **パラメータ**:
  - `userId`: ユーザー ID (必須)
- **レスポンス**:
  - `200 OK`: フラッシュカードの取得に成功
    - `コンテンツ`:
      - `message`: string
      - `flashcards`: flashcard[]
        - `flashcardId`: string
        - `word`: Word
          - `wordId`: string
          - `word`: string
          - `coreMeaning`: string
          - `explanation`: string
        - `meanings`: Meaning[]
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
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## checkFlag 更新 API

- **URL**: `/flashcard/update/checkFlag`
- **メソッド**: `PUT`
- **説明**: フラッシュカードのチェックフラグを更新します。
- **リクエストボディ**:
  - `flashcardId`: string (必須)
  - `checkFlag`: boolean (必須)
- **レスポンス**:
  - `200 OK`: フラッシュカードのチェックフラグの更新に成功
    - `コンテンツ`:
      - `message`: string
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## メモ更新 API

- **URL**: `/flashcard/update/memo`
- **メソッド**: `PUT`
- **説明**: フラッシュカードのメモを更新します。
- **リクエストボディ**:
  - `flashcardId`: string (必須)
  - `memo`: string (必須)
- **レスポンス**:
  - `200 OK`: フラッシュカードのメモの更新に成功
    - `コンテンツ`:
      - `message`: string
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## 意味更新 API

- **URL**: `/flashcard/update/usingMeaningIdList`
- **メソッド**: `PUT`
- **説明**: フラッシュカードに意味を更新します。
- **リクエストボディ**:
  - `flashcardId`: string (必須)
  - `usingMeaningIdList`: string[] (必須)
- **レスポンス**:
  - `200 OK`: フラッシュカードの意味の更新に成功
    - `コンテンツ`:
      - `message`: string
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## メディア生成 API

- **URL**: `/media/create`
- **メソッド**: `POST`
- **説明**: メディアを生成します。
- **リクエストボディ**:
  - `flashcardId`: string (必須)
  - `oldMediaId`: string (必須)
  - `meaningId`: string (必須)
  - `pos`: string (必須)
  - `word`: string (必須)
  - `meaning`: string (必須)
  - `exampleJpn`: string (必須)
  - `explanation`: string (必須)
  - `coreMeaning`: string
  - `generationType`: string (必須)
  - `templateId`: string (必須)
  - `userPrompt`: string (必須)
  - `otherSettings`: string[]
  - `allowGeneratingPerson`: boolean (必須)
  - `inputMediaUrls`: string[]
- **レスポンス**:
  - `200 OK`: メディアの生成に成功
    - `コンテンツ`:
      - `message`: string
      - `comparisonId`: string
      - `newMediaId`: string
      - `newMediaUrls`: string[]
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## メディア比較取得 API

- **URL**: `/comparison/{userId}`
- **メソッド**: `GET`
- **説明**: ユーザーのメディア比較を全て取得します。
- **パラメータ**:
  - `userId`: ユーザー ID (必須)
- **レスポンス**:
  - `200 OK`: メディア比較の取得に成功
    - `コンテンツ`:
      - `message`: string
      - `comparisonId`: string
      - `flashcardId`: string
      - `newMediaId`: string
      - `newMediaUrls`: string[]
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## メディア比較結果 API

- **URL**: `/comparison/update`
- **メソッド**: `POST`
- **説明**: メディアを比較します。
- **リクエストボディ**:
  - `flashcardId`: string (必須)
  - `comparisonId`: string (必須)
  - `oldMediaId`: string (必須)
  - `newMediaId`: string (必須)
  - `isSelectedNew`: boolean (必須)
- **レスポンス**:
  - `200 OK`: メディアの比較に成功
    - `コンテンツ`:
      - `message`: string
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## 意味取得 API

- **URL**: `/meaning/{wordId}`
- **メソッド**: `GET`
- **説明**: 単語のすべての意味を取得します。
- **パラメータ**:
  - `wordId`: 単語 ID (必須)
- **レスポンス**:
  - `200 OK`: 単語の意味の取得に成功
    - `コンテンツ`:
      - `message`: string
      - `meanings`: Meaning[]
        - `meaningId`: string
        - `pos`: string
        - `translation`: string
        - `pronunciation`: string
        - `exampleEng`: string
        - `exampleJpn`: string
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## テンプレート取得 API

- **URL**: `/template`
- **メソッド**: `GET`
- **説明**: 全てのテンプレートを取得します。
- **レスポンス**:
  - `200 OK`: テンプレートの取得に成功
    - `コンテンツ`:
      - `message`: string
      - `templates`: template[]
        - `templateId`: string
        - `generationType`: string
        - `target`: string
        - `preText`: string
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## 単語検索 API

- **URL**: `/word/{word}`
- **メソッド**: `GET`
- **説明**: 指定した単語の情報を取得します。
- **パラメータ**:
  - `word`: 検索する単語 (必須)
- **レスポンス**:
  - `200 OK`: 単語情報の取得に成功
    - `コンテンツ`:
      - `message`: string
      - `word`: Word
        - `wordId`: string
        - `word`: string
        - `coreMeaning`: string
        - `explanation`: string
      - `meanings`: Meaning[]
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
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string

## フラッシュカード追加 API

- **URL**: `/flashcard/add`
- **メソッド**: `POST`
- **説明**: ユーザーのフラッシュカードに新しい単語を追加します。
- **リクエストボディ**:
  - `userId`: string (必須)
  - `word`: Word
    - `wordId`: string (必須)
    - `word`: string (必須)
    - `coreMeaning`: string (必須)
    - `explanation`: string (必須)
  - `meanings`: Meaning[]
    - `meaningId`: string (必須)
    - `pos`: string (必須)
    - `translation`: string (必須)
    - `pronunciation`: string (必須)
    - `exampleEng`: string (必須)
    - `exampleJpn`: string (必須)
  - `media`: Media
    - `mediaId`: string (必須)
    - `meaningId`: string (必須)
    - `mediaUrls`: string[] (必須)
- **レスポンス**:
  - `200 OK`: フラッシュカードの追加に成功
    - `コンテンツ`:
      - `message`: string
  - `422 Validation Error`: 型が不正
    - `コンテンツ`:
      - `detail`: detail[]
        - `loc`: string[]
        - `msg`: string
        - `type`: string
