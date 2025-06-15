import { NextResponse } from "next/server";
import { apiService } from "@/services/apiService";

export async function GET({ params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const flashcards = await apiService.getFlashcards(userId);
    return NextResponse.json({ flashcard: flashcards });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
