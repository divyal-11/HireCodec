import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  
  // Generate invite token
  // const token = generateInviteToken({ interviewId: params.id, ...body });
  const token = Buffer.from(JSON.stringify({
    interviewId: params.id,
    guestName: body.name,
    guestEmail: body.email,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  })).toString('base64url');

  const inviteUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/room/join?token=${token}`;

  return NextResponse.json({
    inviteUrl,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });
}
