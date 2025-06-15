import { NextResponse } from "next/server";
import { apiService } from "@/services/apiService";

export async function GET() {
  try {
    const templates = await apiService.getTemplates();
    return NextResponse.json({ template: templates });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
