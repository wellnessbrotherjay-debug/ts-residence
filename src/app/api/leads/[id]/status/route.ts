import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// PATCH /api/leads/[id]/status
export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    const id = context.params.id;
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: "Could not update status", details: error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request", details: String(err) }, { status: 400 });
  }
}
