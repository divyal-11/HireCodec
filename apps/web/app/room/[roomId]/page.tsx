import { InterviewRoom } from '@/components/interview-room/InterviewRoom';

interface RoomPageProps {
  params: { roomId: string };
  searchParams: { token?: string; name?: string };
}

export const metadata = {
  title: 'Interview Room — Hire Codec',
};

export default function RoomPage({ params, searchParams }: RoomPageProps) {
  const token = searchParams.token || 'dev-token';
  const userName = searchParams.name || 'Anonymous';

  return (
    <InterviewRoom
      roomId={params.roomId}
      token={token}
      userName={userName}
      role="interviewer"
    />
  );
}
