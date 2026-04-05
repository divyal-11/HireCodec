'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getSocket } from '@/lib/socket';

interface UseTimerReturn {
  timeRemaining: number;
  timerState: 'running' | 'paused' | 'done' | 'idle';
  startTimer: (durationSec: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  formattedTime: string;
  isWarning: boolean;
  isCritical: boolean;
}

export function useTimer(roomId: string): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerState, setTimerState] = useState<'running' | 'paused' | 'done' | 'idle'>('idle');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.on('interview:timer_update', ({ remaining, state }: any) => {
      setTimeRemaining(remaining);
      setTimerState(state);
    });

    return () => {
      socket.off('interview:timer_update');
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            setTimerState('done');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  const startTimer = useCallback(
    (durationSec: number) => {
      const socket = getSocket();
      socket.emit('interview:timer_start', { roomId, durationSec });
      setTimeRemaining(durationSec);
      setTimerState('running');
    },
    [roomId]
  );

  const pauseTimer = useCallback(() => {
    const socket = getSocket();
    socket.emit('interview:timer_pause', { roomId });
    setTimerState('paused');
  }, [roomId]);

  const resumeTimer = useCallback(() => {
    const socket = getSocket();
    socket.emit('interview:timer_start', { roomId, durationSec: timeRemaining });
    setTimerState('running');
  }, [roomId, timeRemaining]);

  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return {
    timeRemaining,
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    formattedTime,
    isWarning: timeRemaining < 600 && timeRemaining >= 300,
    isCritical: timeRemaining < 300 && timeRemaining > 0,
  };
}
