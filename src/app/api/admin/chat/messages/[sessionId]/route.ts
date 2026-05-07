import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  try {
    await requireAdminRequest();

    const { sessionId } = await context.params;
    const { data, error } = await supabaseAdmin
      .from("chat_messages")
      .select("id, session_id, role, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Could not fetch chat messages" },
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
