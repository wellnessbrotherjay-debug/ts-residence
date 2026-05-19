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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminRequest();

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Profile id is required" }, { status: 400 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (typeof body.displayName === "string") {
      const displayName = body.displayName.trim();
      if (displayName) {
        updates.display_name = displayName;
      }
    }

    if (typeof body.username === "string") {
      const username = normalizeMarketingUsername(body.username);
      if (!username) {
        return NextResponse.json({ error: "Username is invalid" }, { status: 400 });
      }
      updates.username = username;
    }

    if (typeof body.password === "string") {
      const password = body.password.trim();
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      updates.password_hash = hashMarketingPassword(password);
    }

    if (typeof body.isActive === "boolean") {
      updates.is_active = body.isActive;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("marketing_user_profiles")
      .update(updates)
      .eq("id", id)
      .select("id,username,display_name,is_active,last_login_at,created_at,updated_at")
      .single();

    if (error) {
      if (String(error.code) === "42P01" || String(error.code) === "PGRST205") {
        return NextResponse.json(
          { error: "marketing_user_profiles table not found" },
          { status: 503 },
        );
      }
      if (String(error.code) === "23505") {
        return NextResponse.json({ error: "Username already exists" }, { status: 409 });
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
