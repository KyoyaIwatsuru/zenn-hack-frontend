import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { CheckFlagUpdateRequest } from "@/types/type";

export async function PUT(request: NextRequest) {
  try {
    const body: CheckFlagUpdateRequest = await request.json();

    const missingFields = [];
    if (!body.flashcardId) missingFields.push("flashcardId");
    if (typeof body.checkFlag !== "boolean") missingFields.push("checkFlag");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing or invalid required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await apiService.updateCheckFlag(body);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
