import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

// PATCH - Update session (end time, duration, engagement, etc.)
export async function PATCH(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { session_id, end_time, total_duration_seconds, pages_visited, exit_page, engaged, engaged_at, converted, converted_at, conversion_value } = body;

    if (!session_id) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    // First check if session exists
    const { data: existingSession } = await supabase
      .from("sessions")
      .select("*")
      .eq("session_id", session_id)
      .single();

    if (!existingSession) {
      // Session doesn't exist yet, create it
      const { data: newSession, error: createError } = await supabase
        .from("sessions")
        .insert({
          session_id,
          start_time: new Date(Date.now() - (total_duration_seconds || 0) * 1000).toISOString(),
          end_time: end_time || null,
          total_duration_seconds: total_duration_seconds || null,
          pages_visited: pages_visited || 1,
          page_count: pages_visited || 1,
          exit_page: exit_page || null,
          engaged: engaged || false,
          engaged_at: engaged_at || null,
          converted: converted || false,
          converted_at: converted_at || null,
          conversion_value: conversion_value || 0,
        })
        .select()
        .single();

      if (createError) {
        console.error("session create error", createError);
        return NextResponse.json({ error: "Could not create session" }, { status: 500 });
      }

      return NextResponse.json({ success: true, session: newSession });
    }

    // Update existing session
    const updateData: any = {};
    if (end_time !== undefined) updateData.end_time = end_time;
    if (total_duration_seconds !== undefined) updateData.total_duration_seconds = total_duration_seconds;
    if (pages_visited !== undefined) {
      updateData.pages_visited = pages_visited;
      updateData.page_count = pages_visited;
    }
    if (exit_page !== undefined) updateData.exit_page = exit_page;
    if (engaged !== undefined) updateData.engaged = engaged;
    if (engaged_at !== undefined) updateData.engaged_at = engaged_at;
    if (converted !== undefined) updateData.converted = converted;
    if (converted_at !== undefined) updateData.converted_at = converted_at;
    if (conversion_value !== undefined) updateData.conversion_value = conversion_value;

    const { data: updatedSession, error } = await supabase
      .from("sessions")
      .update(updateData)
      .eq("session_id", session_id)
      .select()
      .single();

    if (error) {
      console.error("session update error", error);
      return NextResponse.json({ error: "Could not update session" }, { status: 500 });
    }

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

// GET - Fetch session data
export async function GET(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");
    const visitor_id = searchParams.get("visitor_id");

    if (!session_id && !visitor_id) {
      return NextResponse.json({ error: "session_id or visitor_id is required" }, { status: 400 });
    }

    let query = supabase.from("sessions").select("*");

    if (session_id) {
      query = query.eq("session_id", session_id);
    } else if (visitor_id) {
      query = query.eq("visitor_id", visitor_id);
    }

    const { data, error } = await query.order("start_time", { ascending: false }).limit(1);

    if (error) {
      console.error("session fetch error", error);
      return NextResponse.json({ error: "Could not fetch session" }, { status: 500 });
    }

    return NextResponse.json({ session: data?.[0] || null });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
