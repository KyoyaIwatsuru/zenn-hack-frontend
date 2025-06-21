import { QUESTION_TYPE_MAPPING } from "@/constants";
import { PromptCondition } from "@/app/user/_components/shared/types";

/**
 * QuestionMode用のプロンプトを構築する
 * @param baseTemplate 基本テンプレート文字列
 * @param promptConditions ユーザーが入力した質問回答条件
 * @returns 完全なプロンプト文字列
 */
export const buildQuestionModePrompt = (
  baseTemplate: string,
  promptConditions: PromptCondition[]
): string => {
  // 1. 基本テンプレートをそのまま使用
  let fullPrompt = baseTemplate;

  // 2. 質問項目の追加
  const validConditions = promptConditions.filter(
    (condition) => condition.value.trim() !== ""
  );

  if (validConditions.length > 0) {
    validConditions.forEach((condition) => {
      const label =
        QUESTION_TYPE_MAPPING[
          condition.type as keyof typeof QUESTION_TYPE_MAPPING
        ] || condition.type;
      fullPrompt += `\n### ${label}\n${condition.value}`;
    });
  }

  return fullPrompt;
};
