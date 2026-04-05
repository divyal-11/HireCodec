// In-memory room state management
// In production, this would use Redis for distributed state

interface RoomParticipant {
  socketId: string;
  userId: string;
  name: string;
  role: string;
  joinedAt: string;
}

interface RoomState {
  roomId: string;
  status: string;
  language: string;
  currentQuestion?: any;
  participants: Map<string, RoomParticipant>;
  chatMessages: any[];
  yjsDeltas: any[];
}

export class RoomService {
  private rooms = new Map<string, RoomState>();

  private getOrCreateRoom(roomId: string): RoomState {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        roomId,
        status: 'active',
        language: 'python',
        participants: new Map(),
        chatMessages: [],
        yjsDeltas: [],
      });
    }
    return this.rooms.get(roomId)!;
  }

  addParticipant(roomId: string, participant: RoomParticipant) {
    const room = this.getOrCreateRoom(roomId);
    room.participants.set(participant.socketId, participant);
  }

  removeParticipant(roomId: string, socketId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants.delete(socketId);
      if (room.participants.size === 0) {
        // Keep room for a while after last participant leaves
        setTimeout(() => {
          if (room.participants.size === 0) {
            this.rooms.delete(roomId);
          }
        }, 60_000);
      }
    }
  }

  getParticipants(roomId: string): RoomParticipant[] {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room.participants.values()) : [];
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId) || null;
  }

  setRoomStatus(roomId: string, status: string) {
    const room = this.rooms.get(roomId);
    if (room) room.status = status;
  }

  appendYjsDelta(roomId: string, delta: any) {
    const room = this.getOrCreateRoom(roomId);
    room.yjsDeltas.push(delta);
    // In production: persist to Redis stream, periodically snapshot to PostgreSQL
  }

  addChatMessage(roomId: string, message: any) {
    const room = this.getOrCreateRoom(roomId);
    room.chatMessages.push(message);
  }

  getChatMessages(roomId: string): any[] {
    return this.rooms.get(roomId)?.chatMessages || [];
  }
}
