import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const mockQuestions = [
    { id: '1', title: 'Two Sum', difficulty: 'EASY', type: 'CODING', tags: ['arrays', 'hash-map'] },
    { id: '2', title: 'LRU Cache', difficulty: 'MEDIUM', type: 'CODING', tags: ['design', 'hash-map'] },
    { id: '3', title: 'Merge K Sorted Lists', difficulty: 'HARD', type: 'CODING', tags: ['heap', 'linked-list'] },
  ];

  return NextResponse.json({ questions: mockQuestions, total: mockQuestions.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newQuestion = {
    id: crypto.randomUUID(),
    ...body,
    slug: body.title.toLowerCase().replace(/\s+/g, '-'),
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(newQuestion, { status: 201 });
}
