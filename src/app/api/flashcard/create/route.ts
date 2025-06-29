import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { FlashcardCreateRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: FlashcardCreateRequest = await request.json();

    if (!body.word) {
      return NextResponse.json(
        { error: "Missing required field: word" },
        { status: 400 }
      );
    }

    const result = await apiService.createFlashcard(body);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
