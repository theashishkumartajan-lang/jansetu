import { NextResponse } from 'next/server';
import { MOCK_ISSUES } from '@/data/mock';
import { Issue } from '@/types';

export async function GET() {
  try {
    // Try Firestore first, fall back to mock data
    try {
      const { getAllIssues } = await import('@/services/firebase/db');
      const issues = await getAllIssues();
      if (issues.length > 0) {
        return NextResponse.json({ success: true, issues }, { status: 200 });
      }
    } catch {
      // Fall back to bundled seed data when Firestore is unavailable.
    }
    return NextResponse.json({ success: true, issues: MOCK_ISSUES }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Issues GET error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, category, severity, location, description, imageUrl } = body;

    if (!userId || !category || !severity || !location || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, category, severity, location, description' },
        { status: 400 }
      );
    }

    const newIssue: Issue = {
      id: `ISS-${Date.now()}`,
      userId,
      category,
      severity,
      status: 'Submitted',
      location,
      description,
      aiSummary: description,
      aiConfidence: 0,
      imageUrl,
      department: 'Public Works',
      trustScore: 70,
      fraudScore: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      escalationLevel: 0,
      votes: 0,
    };

    // Try to save to Firestore
    try {
      const { createIssue } = await import('@/services/firebase/db');
      await createIssue(newIssue);
    } catch {
      // The API response remains usable when Firestore is unavailable.
    }

    return NextResponse.json({ success: true, issue: newIssue }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Issues POST error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
