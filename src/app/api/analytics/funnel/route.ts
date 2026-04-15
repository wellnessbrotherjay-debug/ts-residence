import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

// POST - Track funnel step
export async function POST(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const {
      session_id,
      visitor_id,
      funnel_name = "default",
      step_name,
      step_number,
      step_category,
      page,
      action,
      value = 0,
      currency = "USD",
      metadata = {},
    } = body;

    if (!session_id || !step_name || step_number === undefined) {
      return NextResponse.json({ error: "session_id, step_name, and step_number are required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("funnels")
      .insert({
        session_id,
        visitor_id: visitor_id || null,
        funnel_name,
        step_name,
        step_number,
        step_category: step_category || null,
        page: page || null,
        action: action || null,
        value,
        currency,
        metadata,
      });

    if (error) {
      console.error("funnel insert error", error);
      return NextResponse.json({ error: "Could not persist funnel event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

// GET - Get funnel analytics
export async function GET(req: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Server database is not configured" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const funnel_name = searchParams.get("funnel_name") || "default";
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("funnels")
      .select("*")
      .eq("funnel_name", funnel_name)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("funnel fetch error", error);
      return NextResponse.json({ error: "Could not fetch funnel data" }, { status: 500 });
    }

    // Calculate funnel metrics
    const stepCounts = (data || []).reduce<Record<string, number>>((acc, step) => {
      const key = `${step.step_number}_${step.step_name}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Get unique sessions per step
    const uniqueSessions = (data || []).reduce<Record<number, Set<string>>>((acc, step) => {
      if (!acc[step.step_number]) {
        acc[step.step_number] = new Set();
      }
      acc[step.step_number].add(step.session_id);
      return acc;
    }, {});

    const funnelSteps = Object.keys(uniqueSessions)
      .map(Number)
      .sort((a, b) => a - b)
      .map(stepNum => ({
        step_number: stepNum,
        unique_sessions: uniqueSessions[stepNum]?.size || 0,
      }));

    return NextResponse.json({
      funnel_name,
      period_days: days,
      total_events: data?.length || 0,
      step_counts: stepCounts,
      funnel_steps: funnelSteps,
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
