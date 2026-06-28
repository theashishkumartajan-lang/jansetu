import { NextResponse } from 'next/server';
import { compareImages } from '@/services/gemini/client';
import { VerificationResult } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { beforeImage, afterImage, issueId } = body;

    if (!beforeImage || !afterImage || !issueId) {
      return NextResponse.json(
        { error: 'Missing required fields: beforeImage, afterImage, issueId' },
        { status: 400 }
      );
    }

    const compareResult = await compareImages(beforeImage, afterImage);

    const verification: VerificationResult = {
      issueId,
      status: compareResult.status,
      confidence: compareResult.confidence,
      explanation: compareResult.explanation,
      beforeImage,
      afterImage,
      verifiedAt: new Date(),
    };

    return NextResponse.json({ success: true, verification }, { status: 200 });
  } catch (error: any) {
    console.error('Verify API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
