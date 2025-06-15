import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { UsingMeaningListUpdateRequest } from "@/types/type";

export async function PUT(request: NextRequest) {
  try {
    const body: UsingMeaningListUpdateRequest = await request.json();

    if (!body.flashcardId || !body.usingMeaningList) {
      return NextResponse.json(
        { error: "flashcardId and meaning array are required" },
        { status: 400 }
      );
    }

    await apiService.updateMeaning(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
