import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  hashMarketingPassword,
  normalizeMarketingUsername,
} from "@/lib/marketing-users";

function toErrorMessage(error: unknown): string {
  if (!error) return "Unexpected error";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Unexpected server error";
}

export async function GET() {
  try {
    await requireAdminRequest();

    const { data, error } = await supabaseAdmin
      .from("marketing_user_profiles")
      .select("id,username,display_name,is_active,last_login_at,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      if (String(error.code) === "42P01" || String(error.code) === "PGRST205") {
        return NextResponse.json(
          { error: "marketing_user_profiles table not found" },
          { status: 503 },
        );
      }
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminRequest();

    const body = await request.json();
    const usernameInput = typeof body.username === "string" ? body.username : "";
    const displayNameInput = typeof body.displayName === "string" ? body.displayName : "";
    const passwordInput = typeof body.password === "string" ? body.password : "";

    const username = normalizeMarketingUsername(usernameInput);
    const displayName = displayNameInput.trim();
    const password = passwordInput.trim();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const passwordHash = hashMarketingPassword(password);

    const { data, error } = await supabaseAdmin
      .from("marketing_user_profiles")
      .insert([
        {
          username,
          display_name: displayName || username,
          password_hash: passwordHash,
          is_active: true,
        },
      ])
      .select("id,username,display_name,is_active,last_login_at,created_at,updated_at")
      .single();

    if (error) {
      if (String(error.code) === "23505") {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 },
        );
      }
      if (String(error.code) === "42P01" || String(error.code) === "PGRST205") {
        return NextResponse.json(
          { error: "marketing_user_profiles table not found" },
          { status: 503 },
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED_ADMIN_REQUEST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}
