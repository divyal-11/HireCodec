import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const interview = await prisma.interview.findUnique({
    where: { id: params.id },
    include: {
      participants: {
        include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
      },
      questions: {
        include: {
          question: {
            include: {
              starters: true,
              testCases: { where: { isHidden: false } },
            },
          },
        },
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  if (!interview) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(interview);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { status, notes, startedAt, endedAt } = body;

  const interview = await prisma.interview.update({
    where: { id: params.id },
    data: {
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
      ...(startedAt && { startedAt: new Date(startedAt) }),
      ...(endedAt && { endedAt: new Date(endedAt) }),
    },
  });

  return NextResponse.json(interview);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.interview.update({
    where: { id: params.id },
    data: { status: 'CANCELLED' },
  });

  return NextResponse.json({ message: 'Interview cancelled' });
}
