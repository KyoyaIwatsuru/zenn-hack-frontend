import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { ComparisonUpdateRequest } from "@/types/type";

export async function POST(request: NextRequest) {
  try {
    const body: ComparisonUpdateRequest = await request.json();

    const requiredFields = [
      "comparisonId",
      "oldMediaId",
      "newMediaId",
      "selected",
    ];
    const missingFields = requiredFields.filter(
      (field) => !body[field as keyof ComparisonUpdateRequest]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    await apiService.updateCompare(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
