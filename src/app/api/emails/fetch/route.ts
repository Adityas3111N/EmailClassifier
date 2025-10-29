import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fetchGmailEmails } from "@/lib/gmail";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Session:", session); // Debug log
    console.log("Access Token:", session?.accessToken); // Debug log
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized - No access token" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || "15");

    const emails = await fetchGmailEmails(session.accessToken, count);

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ 
      error: "Failed to fetch emails", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}