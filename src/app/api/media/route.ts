import { NextRequest, NextResponse } from "next/server";
import { flashcardService } from "@/services/apiService";
import { MediaGenerateRequest } from "@/types/type";

export async function POST(request: NextRequest) {
  try {
    const body: MediaGenerateRequest = await request.json();

    const requiredFields = [
      "userId",
      "flashcardId",
      "meaningId",
      "generationType",
      "templateId",
      "userPrompt",
    ];
    const missingFields = requiredFields.filter(
      (field) => !body[field as keyof MediaGenerateRequest]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const media = await flashcardService.generateMedia(body);
    return NextResponse.json({ media });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
