import { NextResponse } from "next/server";
import { flashcardService } from "@/services/apiService";

export async function GET({ params }: { params: { wordId: string } }) {
  try {
    const { wordId } = params;

    if (!wordId) {
      return NextResponse.json(
        { error: "wordId is required" },
        { status: 400 }
      );
    }

    const meanings = await flashcardService.getMeanings(wordId);
    return NextResponse.json({ meaning: meanings });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
