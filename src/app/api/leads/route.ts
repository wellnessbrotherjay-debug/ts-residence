import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      stayDuration,
      message,
      page,
      source,
      medium,
      campaign,
      term,
      content,
      referrer
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "firstName, lastName, and email are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        stay_duration: stayDuration || null,
        message: message || null,
        page: page || null,
        source: source || "direct",
        medium: medium || null,
        campaign: campaign || null,
        term: term || null,
        content: content || null,
        referrer: referrer || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("lead insert error", error);
      return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(250);

    if (error) {
      console.error("fetch leads error", error);
      return NextResponse.json({ error: "Could not fetch leads" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: "Invalid get request" }, { status: 400 });
  }
}
