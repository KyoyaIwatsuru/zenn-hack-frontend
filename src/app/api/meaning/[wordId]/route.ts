import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ wordId: string }> }
) {
  try {
    const { wordId } = await params;

    if (!wordId) {
      return NextResponse.json(
        { error: "wordId is required" },
        { status: 400 }
      );
    }

    const result = await apiService.getMeanings(wordId);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
