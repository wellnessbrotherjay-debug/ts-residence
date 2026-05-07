import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    await requireAdminRequest();

    const { data, error } = await supabaseAdmin
      .from("chat_sessions")
      .select("id, created_at, last_active, user_agent")
      .order("last_active", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { error: "Could not fetch chat sessions" },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
