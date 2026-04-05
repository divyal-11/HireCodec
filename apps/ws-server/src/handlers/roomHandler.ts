import type { Server, Socket } from 'socket.io';
import type { RoomService } from '../services/roomService';

interface JoinPayload {
  roomId: string;
  token: string;
  userName?: string;
}

export class RoomHandler {
  constructor(
    private io: Server,
    private roomService: RoomService
  ) {}

  async handleJoin(socket: Socket, data: JoinPayload) {
    const { roomId, token, userName } = data;

    try {
      // Register participant
      const participant = {
        socketId: socket.id,
        userId: (socket.data as any)?.userId || socket.id,
        name: userName || 'Anonymous',
        role: (socket.data as any)?.role || 'candidate',
        joinedAt: new Date().toISOString(),
      };

      this.roomService.addParticipant(roomId, participant);

      // Join socket room
      socket.join(roomId);
      (socket.data as any).roomId = roomId;

      // Send current state to joiner
      const participants = this.roomService.getParticipants(roomId);
      const roomState = this.roomService.getRoom(roomId);

      socket.emit('room:joined', {
        roomId,
        participants,
        language: roomState?.language || 'python',
        currentQuestion: roomState?.currentQuestion,
      });

      // Notify others
      socket.to(roomId).emit('room:participant_joined', participant);

      // Trigger WebRTC negotiation
      const existingSockets = await this.io.in(roomId).fetchSockets();
      for (const peer of existingSockets) {
        if (peer.id !== socket.id) {
          socket.emit('signal:peer_arrived', { peerId: peer.id, initiator: true });
          peer.emit('signal:peer_arrived', { peerId: socket.id, initiator: false });
        }
      }

      console.log(`[Room] ${participant.name} joined ${roomId} (${participants.length} total)`);
    } catch (error) {
      socket.emit('room:error', {
        code: 'JOIN_FAILED',
        message: (error as Error).message,
      });
    }
  }

  async handleLeave(socket: Socket, data: { roomId: string }) {
    const { roomId } = data;
    this.removeFromRoom(socket, roomId);
    socket.leave(roomId);
  }

  async handleDisconnect(socket: Socket) {
    const roomId = (socket.data as any)?.roomId;
    if (roomId) {
      this.removeFromRoom(socket, roomId);
    }
  }

  async handleEnd(roomId: string) {
    this.roomService.setRoomStatus(roomId, 'ended');
    console.log(`[Room] Interview ended in ${roomId}`);
  }

  private removeFromRoom(socket: Socket, roomId: string) {
    this.roomService.removeParticipant(roomId, socket.id);
    socket.to(roomId).emit('room:participant_left', {
      userId: (socket.data as any)?.userId || socket.id,
      socketId: socket.id,
    });
    console.log(`[Room] ${socket.id} left ${roomId}`);
  }
}
