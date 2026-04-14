import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const { error, data } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select("id");

    if (error) {
      console.error("lead status update error", error);
      return NextResponse.json({ error: "Could not update lead" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
