import type { Server, Socket } from 'socket.io';

export class SignalingHandler {
  constructor(private io: Server) {}

  handleOffer(socket: Socket, data: { roomId: string; to: string; sdp: any }) {
    socket.to(data.roomId).emit('signal:offer', {
      from: socket.id,
      sdp: data.sdp,
    });
  }

  handleAnswer(socket: Socket, data: { roomId: string; to: string; sdp: any }) {
    socket.to(data.roomId).emit('signal:answer', {
      from: socket.id,
      sdp: data.sdp,
    });
  }

  handleIce(socket: Socket, data: { roomId: string; to: string; candidate: any }) {
    socket.to(data.roomId).emit('signal:ice', {
      from: socket.id,
      candidate: data.candidate,
    });
  }
}
