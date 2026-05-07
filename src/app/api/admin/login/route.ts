import { NextResponse } from "next/server";
import {
  isConfiguredAdminPassword,
  setAdminSessionCookie,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password || !isConfiguredAdminPassword(password)) {
      return NextResponse.json(
        { error: "Invalid admin password" },
        { status: 401 },
      );
    }

    const sessionSet = await setAdminSessionCookie();
    if (!sessionSet) {
      return NextResponse.json(
        { error: "Admin auth is not configured on the server" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
