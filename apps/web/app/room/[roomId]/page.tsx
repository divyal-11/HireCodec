import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { generateWSToken } from '@/lib/auth';
import { InterviewRoomStandalone } from '@/components/interview-room/InterviewRoomStandalone';

interface RoomPageProps {
  params: { roomId: string };
  searchParams: { token?: string; name?: string; qid?: string };
}

export const metadata = {
  title: 'Interview Room — Hire Codec',
};

export default async function RoomPage({ params, searchParams }: RoomPageProps) {
  const { roomId } = params;

  // Practice mode — no auth needed, no DB lookup
  if (roomId.startsWith('practice-')) {
    const session = await auth();
    const userName = session?.user?.name || 'Practitioner';
    return (
      <InterviewRoomStandalone
        roomId={roomId}
        token="practice"
        userName={userName}
        role="candidate"
        questionId={searchParams.qid || '1'}
        isPractice={true}
      />
    );
  }

  // Live interview — require authentication
  const session = await auth();
  const inviteToken = searchParams.token;

  if (!session?.user && !inviteToken) {
    redirect('/');
  }

  // Verify the room exists in DB
  const interview = await prisma.interview.findUnique({
    where: { roomId },
    select: { id: true, inviteToken: true, status: true },
  });

  if (!interview) {
    redirect('/dashboard?error=room_not_found');
  }

  // Determine user role from their session
  const userRole = (session?.user as any)?.role;
  const isInterviewer = userRole === 'INTERVIEWER' || userRole === 'ADMIN';

  // Candidates must have the correct invite token
  if (!isInterviewer && interview.inviteToken && inviteToken !== interview.inviteToken) {
    redirect('/dashboard?error=invalid_invite');
  }

  const userId = session?.user?.id || `guest-${Date.now()}`;
  const role = isInterviewer ? 'interviewer' : 'candidate';
  const wsToken = generateWSToken(userId, role);
  const userName = session?.user?.name || searchParams.name || (isInterviewer ? 'Interviewer' : 'Candidate');

  return (
    <InterviewRoomStandalone
      roomId={roomId}
      token={wsToken}
      userName={userName}
      role={role}
      questionId={searchParams.qid || '1'}
      isPractice={false}
    />
  );
}
