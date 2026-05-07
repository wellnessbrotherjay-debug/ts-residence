import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    await requireAdminRequest();

    const { data, error } = await supabaseAdmin
      .from("utm_links")
      .select("id, created_at, name, base_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term, full_url")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      // Table may not exist yet — return empty rather than 500
      if (String(error.code) === "42P01") {
        return NextResponse.json([]);
      }
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("utm-links GET error", err);
    return NextResponse.json([], { status: 200 }); // non-fatal: table may not exist yet
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminRequest();

    const body = await request.json();
    const { name, base_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term, full_url } = body;

    if (!base_url || !full_url) {
      return NextResponse.json({ error: "base_url and full_url are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("utm_links")
      .insert([{ name, base_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term, full_url }])
      .select()
      .single();

    if (error) {
      if (String(error.code) === "42P01") {
        return NextResponse.json(
          { error: "utm_links table not found. Run the SQL shown in the UTM Builder to create it." },
          { status: 503 },
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("utm-links POST error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
