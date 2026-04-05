import type { Socket } from 'socket.io';
import type { RoomService } from '../services/roomService';

export class YjsHandler {
  constructor(private roomService: RoomService) {}

  async handleUpdate(socket: Socket, data: { roomId: string; update: any; origin?: string }) {
    const { roomId, update, origin } = data;

    // Store delta in room service
    this.roomService.appendYjsDelta(roomId, update);

    // Broadcast to all other participants in the room
    socket.to(roomId).emit('yjs:update', { update, origin: socket.id });
  }

  async handleAwareness(socket: Socket, data: { roomId: string; awarenessUpdate: any }) {
    const { roomId, awarenessUpdate } = data;

    // Awareness data (cursors, selections) is ephemeral — don't persist
    socket.to(roomId).emit('yjs:awareness', { awarenessUpdate });
  }
}
