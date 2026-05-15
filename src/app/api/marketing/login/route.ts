import { NextResponse } from "next/server";
import {
  isConfiguredMarketingPassword,
  setMarketingSessionCookie,
} from "@/lib/marketing-auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password || !isConfiguredMarketingPassword(password)) {
      return NextResponse.json(
        { error: "Invalid marketing password" },
        { status: 401 },
      );
    }

    const sessionSet = await setMarketingSessionCookie();
    if (!sessionSet) {
      return NextResponse.json(
        { error: "Marketing auth is not configured on the server" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
