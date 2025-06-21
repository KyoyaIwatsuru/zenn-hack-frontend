import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { MediaCreateRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: MediaCreateRequest = await request.json();

    const requiredFields = [
      "flashcardId",
      "oldMediaId",
      "meaningId",
      "pos",
      "word",
      "meaning",
      "exampleJpn",
      "explanation",
      "generationType",
      "templateId",
      "userPrompt",
    ];
    const missingFields = requiredFields.filter(
      (field) => !body[field as keyof MediaCreateRequest]
    );

    if (typeof body.allowGeneratingPerson !== "boolean") {
      missingFields.push("allowGeneratingPerson");
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing or invalid required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const result = await apiService.createMedia(body);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
