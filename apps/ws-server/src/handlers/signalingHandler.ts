import type { Server, Socket } from 'socket.io';

export class SignalingHandler {
  constructor(private io: Server) {}

  handleOffer(socket: Socket, data: { to: string; sdp: any }) {
    this.io.to(data.to).emit('signal:offer', {
      from: socket.id,
      sdp: data.sdp,
    });
  }

  handleAnswer(socket: Socket, data: { to: string; sdp: any }) {
    this.io.to(data.to).emit('signal:answer', {
      from: socket.id,
      sdp: data.sdp,
    });
  }

  handleIce(socket: Socket, data: { to: string; candidate: any }) {
    this.io.to(data.to).emit('signal:ice', {
      from: socket.id,
      candidate: data.candidate,
    });
  }
}
