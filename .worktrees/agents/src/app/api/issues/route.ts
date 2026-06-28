import { NextResponse } from 'next/server';
import { MOCK_ISSUES } from '@/data/mock';
import { Issue } from '@/types';

export async function GET() {
  try {
    return NextResponse.json({ success: true, issues: MOCK_ISSUES }, { status: 200 });
  } catch (error: any) {
    console.error('Issues GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
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

    return NextResponse.json({ success: true, issue: newIssue }, { status: 201 });
  } catch (error: any) {
    console.error('Issues POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
