# Zenn Hack Frontend

Zennハッカソン用のフラッシュカード学習アプリケーションのフロントエンドです。

## 📝 概要

単語学習を効率化するフラッシュカードアプリケーションです。ユーザーは自分専用のフラッシュカードを作成・管理し、様々な学習機能を利用できます。

### 主な機能

- 🔐 **ユーザー認証** - NextAuth.js + Firebase Authentication
- 📚 **フラッシュカード管理** - 単語・意味・チェックフラグの管理
- ➕ **意味追加機能** - 既存のフラッシュカードに新しい意味を追加
- 🎬 **メディア生成機能** - 単語に関連するメディアコンテンツの生成
- 🔄 **比較機能** - 学習内容の比較・分析
- 📝 **メモ機能** - フラッシュカードに個人的なメモを追加
- 👤 **プロフィール管理** - ユーザー情報の編集

## 🛠 技術スタック

- **フレームワーク**: Next.js 15 (App Router + Turbopack)
- **言語**: TypeScript
- **UIライブラリ**: React 19
- **スタイリング**: TailwindCSS v4
- **コンポーネント**: shadcn/ui (Radix UI)
- **認証**: NextAuth.js v5 + Firebase Authentication
- **フォーム**: React Hook Form + Zod
- **状態管理**: React useReducer
- **コード品質**: ESLint + Prettier

## 🚀 セットアップ

### 必要環境

- Node.js 18.0.0以上
- npm / yarn / pnpm / bun

### インストール

```bash
# リポジトリをクローン
git clone [repository-url]
cd zenn-hack-frontend

# 依存関係をインストール
npm install
```

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```bash
# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"

# API
NEXT_PUBLIC_API_BASE_URL="your-backend-api-url"
```

## 💻 開発

### 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

### その他の便利なコマンド

```bash
# 型チェック
npm run type-check

# リント
npm run lint
npm run lint:fix

# フォーマット
npm run format
npm run format:check

# 全チェック実行
npm run check-all

# プロダクションビルド
npm run build
npm run start
```

## 📁 プロジェクト構造

```
src/
├── app/                    # App Router ページ
│   ├── api/               # API Routes
│   ├── auth/              # 認証関連ページ
│   └── user/              # ユーザーページ
├── components/            # UIコンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   ├── shared/           # 共通コンポーネント
│   └── ui/               # shadcn/ui コンポーネント
├── hooks/                 # カスタムフック
├── lib/                   # ユーティリティ・設定
├── services/              # API通信サービス
├── types/                 # TypeScript型定義
├── constants/             # 定数・バリデーション
└── styles/                # グローバルスタイル
```

## 🎨 開発ガイドライン

### コードスタイル

- **フォーマット**: Prettier (TailwindCSS plugin使用)
- **リント**: ESLint (Next.js + TypeScript設定)
- **コミット前**: `npm run check-all`で全チェック実行推奨

### コンポーネント設計

- **共通コンポーネント**: `src/components/shared/`
- **レイアウト**: `src/components/layout/`
- **型安全性**: 厳密な型定義とdiscriminated union使用
- **エラーハンドリング**: 統一されたエラー処理システム

### 状態管理

- **ローカル状態**: React useState/useReducer
- **API状態**: カスタムフック (`useFlashcards`等)
- **フォーム**: React Hook Form + Zod validation

## 🔧 VS Code設定

`.vscode/settings.json`でTailwindCSS v4とPrettierの設定を含む開発環境が構築されています。

## 📦 主要な依存関係

### 本番依存関係
- `next` - フレームワーク
- `react` / `react-dom` - UIライブラリ
- `next-auth` - 認証
- `firebase` - Firebase SDK
- `@radix-ui/*` - UIプリミティブ
- `react-hook-form` + `zod` - フォーム管理

### 開発依存関係
- `typescript` - 型システム
- `eslint` + `prettier` - コード品質
- `tailwindcss` - スタイリング
- `@tailwindcss/postcss` - PostCSS設定

## 🤝 コントリビューション

1. フィーチャーブランチを作成
2. 変更を実装
3. `npm run check-all`でコード品質をチェック
4. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはプライベートプロジェクトです。