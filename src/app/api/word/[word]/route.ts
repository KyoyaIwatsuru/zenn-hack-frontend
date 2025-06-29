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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
