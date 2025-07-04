import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { UsingMeaningListUpdateRequest } from "@/types";

export async function PUT(request: NextRequest) {
  try {
    const body: UsingMeaningListUpdateRequest = await request.json();

    const missingFields = [];
    if (!body.flashcardId) missingFields.push("flashcardId");
    if (!body.usingMeaningIdList || !Array.isArray(body.usingMeaningIdList)) {
      missingFields.push("usingMeaningIdList");
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing or invalid required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const result = await apiService.updateMeaning(body);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
