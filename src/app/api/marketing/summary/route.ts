import { NextResponse } from 'next/server';
import { Pool } from 'pg';

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  pool = new Pool({ connectionString });
  return pool;
}

export async function GET() {
  try {
    const activePool = getPool();
    if (!activePool) {
      return NextResponse.json([]);
    }

    // Fetch last 30 days of aggregated marketing metrics
    const query = `
      SELECT 
        date::text,
        SUM(sessions) as sessions,
        SUM(spend) as spend,
        SUM(leads) as leads,
        SUM(bookings) as bookings
      FROM mkt_metrics_daily
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY date
      ORDER BY date ASC
    `;
    
    const res = await activePool.query(query);
    
    return NextResponse.json(res.rows);
  } catch (err) {
    console.error('API Marketing Summary Error:', err);
    return NextResponse.json({ error: 'Failed to fetch marketing data' }, { status: 500 });
  }
}
