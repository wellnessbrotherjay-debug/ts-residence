import { NextResponse } from "next/server";
import { clearAdminSessionCookie, isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function DELETE() {
  await clearAdminSessionCookie();
  return NextResponse.json({ success: true });
}
