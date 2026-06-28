import { NextResponse } from 'next/server';
import { runQuickAnalysis } from '@/agents/orchestrator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, text } = body;

    if (!text && !image) {
      return NextResponse.json({ error: 'At least one of text or image is required' }, { status: 400 });
    }

    const { report, category } = await runQuickAnalysis({ image, text });

    return NextResponse.json({
      success: true,
      analysis: {
        report,
        category,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Analyze API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
