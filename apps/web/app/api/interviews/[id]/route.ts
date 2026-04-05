import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // TODO: Fetch from database via Prisma
  return NextResponse.json({
    id: params.id,
    title: 'Interview',
    status: 'SCHEDULED',
    roomId: 'abc-xyz-123',
    scheduledAt: new Date().toISOString(),
    durationMinutes: 60,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  return NextResponse.json({ id: params.id, ...body, updatedAt: new Date().toISOString() });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: 'Interview cancelled', id: params.id });
}
