import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateWSToken } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
  const session = await auth();
  const inviteToken = req.nextUrl.searchParams.get('token');

  // Must have either session or valid invite token
  if (!session?.user && !inviteToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const interview = await prisma.interview.findUnique({
    where: { roomId: params.roomId },
    include: {
      questions: {
        include: {
          question: {
            include: {
              starters: true,
              testCases: { where: { isHidden: false }, orderBy: { orderIndex: 'asc' } },
            },
          },
        },
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  if (!interview) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  const userRole = (session?.user as any)?.role;
  const isInterviewer = userRole === 'INTERVIEWER' || userRole === 'ADMIN';

  // If they are not an interviewer, they MUST have the correct invite token
  if (!isInterviewer && interview.inviteToken && inviteToken !== interview.inviteToken) {
    return NextResponse.json({ error: 'Invalid or missing invite token' }, { status: 403 });
  }

  // Generate a WS auth token for the connecting user
  const userId = session?.user?.id || `guest-${Date.now()}`;
  const role = isInterviewer ? 'interviewer' : 'candidate';
  const wsToken = generateWSToken(userId, role);

  return NextResponse.json({
    roomId: params.roomId,
    interviewId: interview.id,
    status: interview.status,
    wsToken,
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001',
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
    questions: interview.questions.map((iq) => ({
      id: iq.question.id,
      title: iq.question.title,
      description: iq.question.description,
      difficulty: iq.question.difficulty,
      tags: iq.question.tags,
      timeLimitMs: iq.question.timeLimitMs,
      starters: iq.question.starters,
      testCases: iq.question.testCases,
    })),
  });
}
