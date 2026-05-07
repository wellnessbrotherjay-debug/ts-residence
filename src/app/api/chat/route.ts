import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  checkRateLimit,
  getClientIp,
  tooManyRequestsResponse,
} from '@/lib/api-security';

const chatPayloadSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(24),
});

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`chat:${clientIp}`, 20, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return tooManyRequestsResponse(rateLimit.retryAfterMs);
    }

    const payload = await req.json();
    const parsed = chatPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { messages } = parsed.data;
    // messages: [{role: 'system'|'user'|'assistant', content: string}]
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 600,
        temperature: 0.7,
        stream: false,
      }),
    });
    const data = await res.json();
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }
    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || '',
      usage: data.usage,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
