import { NextResponse } from "next/server";
import {
  clearMarketingSessionCookie,
  isMarketingAuthenticated,
} from "@/lib/marketing-auth";

export async function GET() {
  const authenticated = await isMarketingAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  await clearMarketingSessionCookie();
  return NextResponse.json({ success: true });
}
