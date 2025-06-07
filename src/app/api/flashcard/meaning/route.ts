import { NextRequest, NextResponse } from "next/server";
import { flashcardService } from "@/services/apiService";
import { MeaningAddRequest } from "@/types/type";

export async function PUT(request: NextRequest) {
  try {
    const body: MeaningAddRequest = await request.json();

    if (!body.flashcardId || !body.meaning || !Array.isArray(body.meaning)) {
      return NextResponse.json(
        { error: "flashcardId and meaning array are required" },
        { status: 400 }
      );
    }

    await flashcardService.addMeaning(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
