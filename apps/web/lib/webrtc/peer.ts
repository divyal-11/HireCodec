// lib/webrtc/peer.ts — WebRTC peer management with simple-peer

import SimplePeer from 'simple-peer';
import { getSocket } from '../socket';

export interface PeerConnection {
  peerId: string;
  peer: SimplePeer.Instance;
  stream?: MediaStream;
}

export class VideoManager {
  private peers: Map<string, SimplePeer.Instance> = new Map();
  private localStream: MediaStream | null = null;
  private onRemoteStream: ((peerId: string, stream: MediaStream) => void) | null = null;
  private onPeerDisconnect: ((peerId: string) => void) | null = null;

  setCallbacks(callbacks: {
    onRemoteStream: (peerId: string, stream: MediaStream) => void;
    onPeerDisconnect: (peerId: string) => void;
  }) {
    this.onRemoteStream = callbacks.onRemoteStream;
    this.onPeerDisconnect = callbacks.onPeerDisconnect;
  }

  async initLocalStream(
    videoEnabled = true,
    audioEnabled = true
  ): Promise<MediaStream> {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: videoEnabled
        ? { width: 1280, height: 720, frameRate: 30 }
        : false,
      audio: audioEnabled
        ? {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        : false,
    });
    return this.localStream;
  }

  createPeer(peerId: string, initiator: boolean): SimplePeer.Instance {
    const socket = getSocket();

    const iceServers = [
      { urls: process.env.NEXT_PUBLIC_STUN_URL || 'stun:stun.l.google.com:19302' },
    ];

    if (process.env.NEXT_PUBLIC_TURN_URL) {
      iceServers.push({
        urls: process.env.NEXT_PUBLIC_TURN_URL,
        username: process.env.NEXT_PUBLIC_TURN_USER,
        credential: process.env.NEXT_PUBLIC_TURN_PASS,
      } as any);
    }

    const peer = new SimplePeer({
      initiator,
      stream: this.localStream || undefined,
      trickle: true,
      config: { iceServers },
    });

    peer.on('signal', (signalData: any) => {
      if (signalData.type === 'offer') {
        socket.emit('signal:offer', { to: peerId, sdp: signalData });
      } else if (signalData.type === 'answer') {
        socket.emit('signal:answer', { to: peerId, sdp: signalData });
      } else {
        socket.emit('signal:ice', { to: peerId, candidate: signalData });
      }
    });

    peer.on('stream', (remoteStream: MediaStream) => {
      this.onRemoteStream?.(peerId, remoteStream);
    });

    peer.on('close', () => {
      this.peers.delete(peerId);
      this.onPeerDisconnect?.(peerId);
    });

    peer.on('error', (err: Error) => {
      console.error(`[WebRTC] Peer ${peerId} error:`, err);
      this.peers.delete(peerId);
      this.onPeerDisconnect?.(peerId);
    });

    this.peers.set(peerId, peer);
    return peer;
  }

  signal(peerId: string, signalData: any): void {
    const peer = this.peers.get(peerId);
    if (peer && !peer.destroyed) {
      peer.signal(signalData);
    }
  }

  toggleAudio(enabled: boolean): void {
    this.localStream?.getAudioTracks().forEach((t) => (t.enabled = enabled));
  }

  toggleVideo(enabled: boolean): void {
    this.localStream?.getVideoTracks().forEach((t) => (t.enabled = enabled));
  }

  async startScreenShare(): Promise<MediaStream> {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 15 },
    });
    const screenTrack = screenStream.getVideoTracks()[0];

    // Replace video track in all peers
    this.peers.forEach((peer) => {
      const sender = (peer as any)._pc
        ?.getSenders()
        ?.find((s: RTCRtpSender) => s.track?.kind === 'video');
      sender?.replaceTrack(screenTrack);
    });

    screenTrack.onended = () => this.stopScreenShare();
    return screenStream;
  }

  async stopScreenShare(): Promise<void> {
    if (!this.localStream) return;
    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      this.peers.forEach((peer) => {
        const sender = (peer as any)._pc
          ?.getSenders()
          ?.find((s: RTCRtpSender) => s.track?.kind === 'video');
        sender?.replaceTrack(videoTrack);
      });
    }
  }

  destroyAll(): void {
    this.peers.forEach((peer) => {
      if (!peer.destroyed) peer.destroy();
    });
    this.peers.clear();
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.localStream = null;
  }

  getPeer(peerId: string): SimplePeer.Instance | undefined {
    return this.peers.get(peerId);
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }
}

export const videoManager = new VideoManager();
