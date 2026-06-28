import { NextResponse } from 'next/server';
import { MOCK_LEADERBOARD } from '@/data/mock';

export async function GET() {
  try {
    return NextResponse.json({ success: true, leaderboard: MOCK_LEADERBOARD }, { status: 200 });
  } catch (error: any) {
    console.error('Leaderboard GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
