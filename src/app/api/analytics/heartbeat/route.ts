import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

// POST - Heartbeat to keep session alive
export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    // Update session's updated_at timestamp
    const { error } = await supabase
      .from("sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("session_id", session_id);

    if (error) {
      console.error("heartbeat error", error);
      // Don't fail on heartbeat errors, just log them
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
