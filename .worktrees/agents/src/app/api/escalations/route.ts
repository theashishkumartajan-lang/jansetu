import { NextResponse } from 'next/server';
import { MOCK_ESCALATIONS } from '@/data/mock';

export async function GET() {
  try {
    return NextResponse.json({ success: true, escalations: MOCK_ESCALATIONS }, { status: 200 });
  } catch (error: any) {
    console.error('Escalations GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
