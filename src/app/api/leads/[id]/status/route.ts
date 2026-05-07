import { NextResponse, NextRequest } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

// PATCH /api/leads/[id]/status
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminRequest();

    const { status } = await request.json();
    const { id } = await context.params;
    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from("leads")
      .update({ status })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: "Could not update status", details: error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: "Invalid request", details: String(err) }, { status: 400 });
  }
}
