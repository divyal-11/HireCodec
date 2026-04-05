import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({
    id: crypto.randomUUID(),
    interviewId: body.interviewId,
    overallScore: body.overallScore,
    hireDecision: body.hireDecision,
    submittedAt: new Date().toISOString(),
  }, { status: 201 });
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ feedback: [] });
}
