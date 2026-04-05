'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket';
import type { RoomState, RoomParticipant } from '@hire-codec/shared';

interface UseRoomOptions {
  roomId: string;
  token: string;
  userName: string;
}

interface UseRoomReturn {
  connected: boolean;
  participants: RoomParticipant[];
  roomState: RoomState | null;
  error: string | null;
  joinRoom: () => void;
  leaveRoom: () => void;
  endInterview: () => void;
  sendChat: (content: string, type?: 'text' | 'code') => void;
  setQuestion: (questionId: string) => void;
}

export function useRoom({ roomId, token, userName }: UseRoomOptions): UseRoomReturn {
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef(getSocket());

  useEffect(() => {
    const socket = connectSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('room:joined', (data: any) => {
      setRoomState(data);
      setParticipants(data.participants || []);
    });

    socket.on('room:participant_joined', (participant: RoomParticipant) => {
      setParticipants((prev) => [...prev, participant]);
    });

    socket.on('room:participant_left', ({ userId }: { userId: string }) => {
      setParticipants((prev) => prev.filter((p) => p.userId !== userId));
    });

    socket.on('room:error', ({ code, message }: { code: string; message: string }) => {
      setError(`${code}: ${message}`);
    });

    socket.on('interview:ended', ({ reason, redirectUrl }: any) => {
      setRoomState((prev) => prev ? { ...prev, status: 'ended' } : null);
    });

    return () => {
      socket.emit('room:leave', { roomId });
      disconnectSocket();
    };
  }, [roomId, token]);

  const joinRoom = useCallback(() => {
    socketRef.current.emit('room:join', { roomId, token, userName });
  }, [roomId, token, userName]);

  const leaveRoom = useCallback(() => {
    socketRef.current.emit('room:leave', { roomId });
  }, [roomId]);

  const endInterview = useCallback(() => {
    socketRef.current.emit('interview:end', { roomId });
  }, [roomId]);

  const sendChat = useCallback(
    (content: string, type: 'text' | 'code' = 'text') => {
      socketRef.current.emit('chat:message', { roomId, content, type });
    },
    [roomId]
  );

  const setQuestion = useCallback(
    (questionId: string) => {
      socketRef.current.emit('interview:set_question', { roomId, questionId });
    },
    [roomId]
  );

  return {
    connected,
    participants,
    roomState,
    error,
    joinRoom,
    leaveRoom,
    endInterview,
    sendChat,
    setQuestion,
  };
}
