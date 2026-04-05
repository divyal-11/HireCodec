export interface RoomState {
  roomId: string;
  interviewId: string;
  status: 'waiting' | 'active' | 'ended';
  participants: RoomParticipant[];
  currentQuestion?: RoomQuestion;
  language: string;
  timerState?: TimerState;
}

export interface RoomParticipant {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  joinedAt: string;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
}

export interface RoomQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  starterCode?: string;
}

export interface TimerState {
  remaining: number;
  state: 'running' | 'paused' | 'done';
  startedAt: string;
}

// ─── WebSocket Event Payloads ─────────────────────────────

export interface JoinRoomPayload {
  roomId: string;
  token: string;
  userName?: string;
}

export interface YjsUpdatePayload {
  roomId: string;
  update: Uint8Array;
  origin?: string;
}

export interface AwarenessPayload {
  roomId: string;
  awarenessUpdate: Uint8Array;
}

export interface ChatMessagePayload {
  roomId: string;
  content: string;
  type: 'text' | 'code';
}

export interface SignalPayload {
  to: string;
  from?: string;
  sdp?: any;
  candidate?: any;
}

export interface MediaTogglePayload {
  roomId: string;
  type: 'audio' | 'video';
  enabled: boolean;
}

export interface LanguageChangePayload {
  roomId: string;
  language: string;
  starterCode?: string;
}

export interface InterviewControlPayload {
  roomId: string;
  questionId?: string;
  durationSec?: number;
}
