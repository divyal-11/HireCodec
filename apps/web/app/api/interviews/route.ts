import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // TODO: Integrate with real database
  const mockInterviews = [
    { id: '1', title: 'Senior Frontend Engineer', status: 'SCHEDULED', roomId: 'abc-xyz-123', scheduledAt: '2026-04-06T14:00:00Z' },
    { id: '2', title: 'Backend Developer', status: 'ACTIVE', roomId: 'def-uvw-456', scheduledAt: '2026-04-05T16:30:00Z' },
  ];

  return NextResponse.json({ interviews: mockInterviews, total: mockInterviews.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  const newInterview = {
    id: crypto.randomUUID(),
    ...body,
    roomId: generateShortId(),
    status: 'SCHEDULED',
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(newInterview, { status: 201 });
}

function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return [3, 3, 3].map((len) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  ).join('-');
}
