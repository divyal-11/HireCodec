import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const difficulty = searchParams.get('difficulty');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');

  const where: any = { isArchived: false };
  if (difficulty && difficulty !== 'ALL') where.difficulty = difficulty;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { tags: { has: search.toLowerCase() } },
    ];
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        type: true,
        tags: true,
        timeLimitMs: true,
        memoryLimitMb: true,
        createdAt: true,
        _count: { select: { testCases: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.question.count({ where }),
  ]);

  return NextResponse.json({ questions, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userRole = (session.user as any).role;
  if (userRole === 'CANDIDATE') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { title, description, difficulty, type, tags, timeLimitMs, memoryLimitMb } = body;

  if (!title || !description || !difficulty) {
    return NextResponse.json({ error: 'title, description, difficulty required' }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      difficulty,
      type: type || 'CODING',
      tags: tags || [],
      timeLimitMs: timeLimitMs || 5000,
      memoryLimitMb: memoryLimitMb || 256,
      createdById: session.user.id,
    },
  });

  return NextResponse.json(question, { status: 201 });
}
