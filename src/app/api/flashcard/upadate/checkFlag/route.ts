import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { CheckFlagUpdateRequest } from "@/types/type";

export async function PUT(request: NextRequest) {
  try {
    const body: CheckFlagUpdateRequest = await request.json();

    if (!body.flashcardId || typeof body.checkFlag !== "boolean") {
      return NextResponse.json(
        { error: "flashcardId and checkFlag are required" },
        { status: 400 }
      );
    }

    await apiService.updateCheckFlag(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
