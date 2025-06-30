import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ word: string }> }
) {
  try {
    const { word } = await params;

    if (!word) {
      return NextResponse.json(
        { error: "Missing required parameter: word" },
        { status: 400 }
      );
    }

    const result = await apiService.getWordInfo(word);
    return NextResponse.json(result);
  } catch (error) {
    // FastAPIからの404エラーを適切に処理
    if (error instanceof Error) {
      const errorMessage = error.message;

      // FastAPIからの404エラーパターンをチェック
      if (
        errorMessage.includes(
          '{"error":"要求されたリソースが見つかりません。"}'
        ) ||
        errorMessage.includes("指定された単語が見つかりません") ||
        errorMessage.includes("response status is 404")
      ) {
        return NextResponse.json(
          { error: "指定された単語が見つかりません" },
          { status: 404 }
        );
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
