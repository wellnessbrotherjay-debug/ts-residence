import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import {
  checkRateLimit,
  getClientIp,
  tooManyRequestsResponse,
} from '@/lib/api-security';
import { getRequestContext } from '@/lib/request-context';

const chatLogSchema = z.object({
  session_id: z.string().trim().min(1).max(255),
  user_agent: z.string().trim().max(1024).optional(),
  ip_address: z.string().trim().max(128).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .max(100),
});

export async function POST(req: Request) {
  try {
    const context = getRequestContext(req);
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`chat-log:${clientIp}`, 60, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return tooManyRequestsResponse(rateLimit.retryAfterMs);
    }

    const payload = await req.json();
    const parsed = chatLogSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { session_id, messages } = parsed.data;
    // Upsert session
    await supabase.from('chat_sessions').upsert({
      id: session_id,
      user_agent: context.userAgent,
      ip_address: context.ip,
      last_active: new Date().toISOString(),
    });
    // Insert messages
    const inserts = messages.map((m) => ({
      session_id,
      role: m.role,
      content: m.content,
    }));
    await supabase.from('chat_messages').insert(inserts);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Log error' }, { status: 500 });
  }
}
