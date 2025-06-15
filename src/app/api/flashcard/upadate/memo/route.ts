import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { MemoUpdateRequest } from "@/types/type";

export async function PUT(request: NextRequest) {
  try {
    const body: MemoUpdateRequest = await request.json();

    if (!body.flashcardId || typeof body.memo !== "string") {
      return NextResponse.json(
        { error: "flashcardId and memo are required" },
        { status: 400 }
      );
    }

    await apiService.updateMemo(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
