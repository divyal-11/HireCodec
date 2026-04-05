import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ id: params.id, title: 'Question', difficulty: 'MEDIUM' });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  return NextResponse.json({ id: params.id, ...body });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: 'Question archived', id: params.id });
}
