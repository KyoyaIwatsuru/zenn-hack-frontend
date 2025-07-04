import { NextRequest, NextResponse } from "next/server";
import { apiService } from "@/services/apiService";
import { User } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: User = await request.json();

    const requiredFields = ["userId", "userName", "email"];
    const missingFields = requiredFields.filter(
      (field) => !body[field as keyof User]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await apiService.setupUser(body);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
