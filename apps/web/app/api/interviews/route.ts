import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendInterviewInvite } from '@/lib/email';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userRole = (session.user as any).role;
  if (userRole === 'CANDIDATE') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const where: any = {};
  if (status && status !== 'ALL') where.status = status;

  const [interviews, total] = await Promise.all([
    prisma.interview.findMany({
      where,
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        },
        questions: {
          include: { question: { select: { id: true, title: true, difficulty: true } } },
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.interview.count({ where }),
  ]);

  return NextResponse.json({ interviews, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userRole = (session.user as any).role;
  if (userRole === 'CANDIDATE') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { title, scheduledAt, durationMinutes, candidateName, candidateEmail, interviewerName, questionIds } = body;

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  const roomId = generateShortId();

  const inviteToken = crypto.randomBytes(16).toString('hex');

  const interview = await prisma.interview.create({
    data: {
      title,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      durationMinutes: durationMinutes || 60,
      roomId,
      inviteToken,
      status: 'SCHEDULED',
      participants: {
        create: [
          { userId: session.user.id, role: 'interviewer' },
          ...(candidateName ? [{
            role: 'candidate',
            guestName: candidateName,
            guestEmail: candidateEmail,
          }] : []),
        ],
      },
      questions: {
        create: (questionIds || []).map((qId: string, i: number) => ({
          questionId: qId,
          orderIndex: i,
        })),
      },
    },
    include: {
      participants: true,
      questions: { include: { question: true } },
    },
  });
  // Send invite email to candidate if email was provided
  if (candidateEmail) {
    const baseUrl = process.env.AUTH_URL || 'http://localhost:3000';
    const roomUrl = `${baseUrl}/room/${roomId}?token=${inviteToken}`;
    await sendInterviewInvite({
      candidateEmail,
      candidateName: candidateName || 'Candidate',
      interviewTitle: title,
      interviewerName: interviewerName || session.user.name || 'Interviewer',
      scheduledAt: scheduledAt || null,
      roomUrl,
    });
  }

  return NextResponse.json(interview, { status: 201 });
}

function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return [3, 3, 3]
    .map((len) =>
      Array.from({ length: len }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    )
    .join('-');
}
