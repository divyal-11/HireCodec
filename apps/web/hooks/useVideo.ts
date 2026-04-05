'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { videoManager } from '@/lib/webrtc/peer';
import { setupSignaling } from '@/lib/webrtc/signaling';
import { getSocket } from '@/lib/socket';

interface RemoteStream {
  peerId: string;
  stream: MediaStream;
}

interface UseVideoReturn {
  localStream: MediaStream | null;
  remoteStreams: RemoteStream[];
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => void;
  initVideo: (video?: boolean, audio?: boolean) => Promise<void>;
}

export function useVideo(roomId: string): UseVideoReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const cleanupSignaling = useRef<(() => void) | null>(null);

  useEffect(() => {
    videoManager.setCallbacks({
      onRemoteStream: (peerId, stream) => {
        setRemoteStreams((prev) => {
          const existing = prev.find((r) => r.peerId === peerId);
          if (existing) {
            return prev.map((r) => (r.peerId === peerId ? { ...r, stream } : r));
          }
          return [...prev, { peerId, stream }];
        });
      },
      onPeerDisconnect: (peerId) => {
        setRemoteStreams((prev) => prev.filter((r) => r.peerId !== peerId));
      },
    });

    cleanupSignaling.current = setupSignaling();

    return () => {
      cleanupSignaling.current?.();
      videoManager.destroyAll();
    };
  }, [roomId]);

  const initVideo = useCallback(async (video = true, audio = true) => {
    try {
      const stream = await videoManager.initLocalStream(video, audio);
      setLocalStream(stream);
      setAudioEnabled(audio);
      setVideoEnabled(video);
    } catch (err) {
      console.error('[Video] Failed to init media:', err);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    const newState = !audioEnabled;
    videoManager.toggleAudio(newState);
    setAudioEnabled(newState);
    const socket = getSocket();
    socket.emit('media:toggle', { roomId, type: 'audio', enabled: newState });
  }, [audioEnabled, roomId]);

  const toggleVideo = useCallback(() => {
    const newState = !videoEnabled;
    videoManager.toggleVideo(newState);
    setVideoEnabled(newState);
    const socket = getSocket();
    socket.emit('media:toggle', { roomId, type: 'video', enabled: newState });
  }, [videoEnabled, roomId]);

  const startScreenShare = useCallback(async () => {
    try {
      await videoManager.startScreenShare();
      setIsScreenSharing(true);
    } catch (err) {
      console.error('[Video] Screen share failed:', err);
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    videoManager.stopScreenShare();
    setIsScreenSharing(false);
  }, []);

  return {
    localStream,
    remoteStreams,
    audioEnabled,
    videoEnabled,
    isScreenSharing,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    initVideo,
  };
}
