import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { session_id, messages, user_agent, ip_address } = await req.json();
    // Upsert session
    await supabase.from('chat_sessions').upsert({
      id: session_id,
      user_agent,
      ip_address,
      last_active: new Date().toISOString(),
    });
    // Insert messages
    const inserts = messages.map((m: { role: string; content: string }) => ({
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
