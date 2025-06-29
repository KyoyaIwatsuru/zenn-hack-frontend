import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { UsingFlashcardAddRequest } from "@/types";

export async function PUT(request: NextRequest) {
  try {
    const body: UsingFlashcardAddRequest = await request.json();

    const requiredFields = ["userId", "flashcardId"];
    const missingFields = requiredFields.filter(
      (field) => !body[field as keyof UsingFlashcardAddRequest]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await apiService.addUsingFlashcard(body);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
