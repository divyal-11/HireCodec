import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
  return NextResponse.json({
    roomId: params.roomId,
    status: 'active',
    participants: [],
    iceServers: [
      { urls: process.env.NEXT_PUBLIC_STUN_URL || 'stun:stun.l.google.com:19302' },
    ],
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  });
}
