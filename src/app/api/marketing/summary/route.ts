import { NextResponse } from 'next/server';
import { requireAdminRequest } from '@/lib/admin-auth';
import { getGa4MarketingSummary } from '@/lib/ga4-reporting';

export async function GET() {
  try {
    await requireAdminRequest();

    const summary = await getGa4MarketingSummary();
    if (!summary) {
      return NextResponse.json(
        { error: 'GA4 reporting is not configured on the server' },
        { status: 503 },
      );
    }

    return NextResponse.json(summary);
  } catch (err) {
    if (err instanceof Error && err.message === 'UNAUTHORIZED_ADMIN_REQUEST') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('API Marketing Summary Error:', err);
    return NextResponse.json({ error: 'Failed to fetch marketing data' }, { status: 500 });
  }
}
