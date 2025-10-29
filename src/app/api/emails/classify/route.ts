import { NextRequest, NextResponse } from "next/server";
import { classifyEmails } from "@/lib/langchain";

export async function POST(request: NextRequest) {
  try {
    const { emails, openAiKey } = await request.json();

    if (!openAiKey) {
      return NextResponse.json({ error: "OpenAI key required" }, { status: 400 });
    }

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json({ error: "Invalid emails data" }, { status: 400 });
    }

    const classifiedEmails = await classifyEmails(emails, openAiKey);

    return NextResponse.json({ emails: classifiedEmails });
  } catch (error) {
    console.error("Error classifying emails:", error);
    return NextResponse.json({ error: "Failed to classify emails" }, { status: 500 });
  }
}