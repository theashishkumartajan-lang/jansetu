import { NextResponse } from 'next/server';
import { MOCK_ESCALATIONS } from '@/data/mock';

export async function GET() {
  try {
    return NextResponse.json({ success: true, escalations: MOCK_ESCALATIONS }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Escalations GET error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
