import { NextResponse } from "next/server";
import {
  isConfiguredMarketingPassword,
  isMarketingPasswordConfigured,
  setMarketingSessionCookie,
} from "@/lib/marketing-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { normalizeMarketingUsername, verifyMarketingPassword } from "@/lib/marketing-users";
import { trackMarketingLogin } from "@/lib/marketing-activity";

async function writeLoginAudit(entry: {
  username: string;
  success: boolean;
  method: string;
  reason?: string;
}) {
  try {
    await supabaseAdmin.from("marketing_auth_events").insert([
      {
        username: entry.username,
        success: entry.success,
        method: entry.method,
        reason: entry.reason || null,
      },
    ]);
  } catch {
    // Audit table is optional; avoid blocking auth flow.
  }
}

export async function POST(request: Request) {
  try {
    if (!isMarketingPasswordConfigured()) {
      return NextResponse.json(
        { error: "Marketing password is not configured on the server" },
        { status: 500 },
      );
    }

    const { username, password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    if (!username || typeof username !== "string" || !username.trim()) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    const normalizedUsername = normalizeMarketingUsername(username);
    if (!normalizedUsername) {
      return NextResponse.json(
        { error: "Username is invalid" },
        { status: 400 },
      );
    }

    let resolvedUserName: string | null = null;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("marketing_user_profiles")
      .select("id,username,display_name,password_hash,is_active")
      .eq("username", normalizedUsername)
      .maybeSingle();

    if (
      profileError &&
      String(profileError.code) !== "42P01" &&
      String(profileError.code) !== "PGRST205"
    ) {
      throw profileError;
    }

    if (profile && profile.is_active) {
      const storedHash = typeof profile.password_hash === "string" ? profile.password_hash : "";
      const validPassword = storedHash ? verifyMarketingPassword(password, storedHash) : false;
      if (!validPassword) {
        await writeLoginAudit({
          username: normalizedUsername,
          success: false,
          method: "profile",
          reason: "invalid_password",
        });

        return NextResponse.json(
          { error: "Invalid marketing username or password" },
          { status: 401 },
        );
      }

      resolvedUserName = profile.display_name || profile.username;

      await supabaseAdmin
        .from("marketing_user_profiles")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", profile.id);

      await writeLoginAudit({
        username: normalizedUsername,
        success: true,
        method: "profile",
      });
    } else {
      if (!isConfiguredMarketingPassword(password)) {
        await writeLoginAudit({
          username: normalizedUsername,
          success: false,
          method: "fallback-password",
          reason: "invalid_password",
        });

        return NextResponse.json(
          { error: "Invalid marketing username or password" },
          { status: 401 },
        );
      }

      resolvedUserName = normalizedUsername;
      await writeLoginAudit({
        username: normalizedUsername,
        success: true,
        method: "fallback-password",
      });
    }

    const sessionSet = await setMarketingSessionCookie(resolvedUserName);
    if (!sessionSet) {
      return NextResponse.json(
        { error: "Marketing auth is not configured on the server" },
        { status: 500 },
      );
    }

    // Track login activity
    await trackMarketingLogin(profile?.id || null, resolvedUserName || normalizedUsername);

    return NextResponse.json({ success: true, userName: resolvedUserName });
  } catch (error) {
    console.error("marketing login error", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
