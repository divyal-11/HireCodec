import type { Server, Socket } from 'socket.io';
import type { RoomService } from '../services/roomService';

export class ChatHandler {
  constructor(
    private io: Server,
    private roomService: RoomService
  ) {}

  handleMessage(socket: Socket, data: { roomId: string; content: string; type: string }) {
    const { roomId, content, type } = data;
    const userId = (socket.data as any)?.userId || socket.id;
    const userName = (socket.data as any)?.userName || 'Anonymous';

    const message = {
      id: crypto.randomUUID(),
      senderId: userId,
      senderName: userName,
      content,
      type: type || 'text',
      sentAt: new Date().toISOString(),
    };

    // Store message
    this.roomService.addChatMessage(roomId, message);

    // Broadcast to all in room (including sender)
    this.io.in(roomId).emit('chat:message', message);
  }
}
