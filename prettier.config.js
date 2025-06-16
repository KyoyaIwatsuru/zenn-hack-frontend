/** @type {import("prettier").Config} */
const config = {
  // 基本設定
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",

  // JSX設定
  jsxSingleQuote: false,

  // 末尾カンマ
  trailingComma: "es5",

  // 括弧設定
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",

  // 改行設定
  endOfLine: "lf",

  // ファイル形式設定
  overrides: [
    {
      files: "*.md",
      options: {
        printWidth: 100,
        proseWrap: "always",
      },
    },
    {
      files: "*.json",
      options: {
        printWidth: 120,
      },
    },
  ],

  // プラグイン
  plugins: ["prettier-plugin-tailwindcss"],

  // TailwindCSS設定
  tailwindFunctions: ["clsx", "cn", "cva"],
};

module.exports = config;
