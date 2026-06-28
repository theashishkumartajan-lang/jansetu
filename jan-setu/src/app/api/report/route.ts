import { NextResponse } from 'next/server';
import { runAgentPipeline } from '@/agents/orchestrator';
import { Issue, ReportInput } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, text, voiceText, userId, location } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const input: ReportInput = {
      userId,
      image,
      description: text,
      voiceText,
      location,
    };

    const { results, summary } = await runAgentPipeline(input);

    const issueId = `ISS-${Date.now()}`;
    const issue: Issue = {
      id: issueId,
      userId,
      category: summary.category || 'Other',
      severity: summary.severity || 'Medium',
      status: summary.status || 'Validated',
      location: location || { lat: 19.076, lng: 72.8777, address: 'Unknown location' },
      description: summary.aiSummary || text || voiceText || 'No description',
      aiSummary: summary.aiSummary || '',
      aiConfidence: summary.aiConfidence || 0,
      imageUrl: typeof image === 'string' ? image : undefined,
      department: summary.department || 'Public Works',
      trustScore: summary.trustScore || 70,
      fraudScore: summary.fraudScore || 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      escalationLevel: summary.escalationLevel || 0,
      votes: 0,
    };

    // Try to save to Firestore if Firebase is configured
    try {
      const { createIssue } = await import('@/services/firebase/db');
      await createIssue(issue);
    } catch {
      // The report still returns successfully when Firestore is unavailable.
    }

    return NextResponse.json({
      success: true,
      issue,
      results,
      summary,
    }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Report API error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
