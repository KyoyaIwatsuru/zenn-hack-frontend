import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { ComparisonUpdateRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: ComparisonUpdateRequest = await request.json();

    const requiredFields = [
      "flashcardId",
      "comparisonId",
      "oldMediaId",
      "newMediaId",
    ];
    const missingFields = requiredFields.filter(
      (field) => !body[field as keyof ComparisonUpdateRequest]
    );

    if (typeof body.isSelectedNew !== "boolean") {
      missingFields.push("isSelectedNew");
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing or invalid required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const result = await apiService.updateCompare(body);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
