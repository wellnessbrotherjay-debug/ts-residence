import { NextResponse } from "next/server";
import {
  clearMarketingSessionCookie,
  getMarketingSession,
} from "@/lib/marketing-auth";

export async function GET() {
  const session = await getMarketingSession();
  return NextResponse.json({
    authenticated: session.authenticated,
    userName: session.userName,
  });
}

export async function DELETE() {
  await clearMarketingSessionCookie();
  return NextResponse.json({ success: true });
}
