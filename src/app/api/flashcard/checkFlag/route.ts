import { NextRequest, NextResponse } from "next/server";
import { flashcardService } from "@/services/apiService";
import { CheckFlagRequest } from "@/types/type";

export async function PUT(request: NextRequest) {
  try {
    const body: CheckFlagRequest = await request.json();

    if (!body.flashcardId || typeof body.checkFlag !== "boolean") {
      return NextResponse.json(
        { error: "flashcardId and checkFlag are required" },
        { status: 400 }
      );
    }

    await flashcardService.updateCheckFlag(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
