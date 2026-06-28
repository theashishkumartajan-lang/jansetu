import { NextResponse } from 'next/server';
import { MOCK_PREDICTIONS } from '@/data/mock';

export async function GET() {
  try {
    return NextResponse.json({ success: true, predictions: MOCK_PREDICTIONS }, { status: 200 });
  } catch (error: any) {
    console.error('Predictions GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
