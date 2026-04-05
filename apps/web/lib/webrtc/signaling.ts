// lib/webrtc/signaling.ts — Socket.io signaling for WebRTC

import { getSocket } from '../socket';
import { videoManager } from './peer';

export function setupSignaling(): () => void {
  const socket = getSocket();

  const handlePeerArrived = ({ peerId, initiator }: { peerId: string; initiator: boolean }) => {
    console.log(`[Signaling] Peer arrived: ${peerId}, initiator: ${initiator}`);
    videoManager.createPeer(peerId, initiator);
  };

  const handleOffer = ({ from, sdp }: { from: string; sdp: any }) => {
    console.log(`[Signaling] Received offer from ${from}`);
    let peer = videoManager.getPeer(from);
    if (!peer) {
      peer = videoManager.createPeer(from, false);
    }
    videoManager.signal(from, sdp);
  };

  const handleAnswer = ({ from, sdp }: { from: string; sdp: any }) => {
    console.log(`[Signaling] Received answer from ${from}`);
    videoManager.signal(from, sdp);
  };

  const handleIce = ({ from, candidate }: { from: string; candidate: any }) => {
    videoManager.signal(from, candidate);
  };

  socket.on('signal:peer_arrived', handlePeerArrived);
  socket.on('signal:offer', handleOffer);
  socket.on('signal:answer', handleAnswer);
  socket.on('signal:ice', handleIce);

  return () => {
    socket.off('signal:peer_arrived', handlePeerArrived);
    socket.off('signal:offer', handleOffer);
    socket.off('signal:answer', handleAnswer);
    socket.off('signal:ice', handleIce);
  };
}
