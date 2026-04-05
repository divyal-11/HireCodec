import type { Server, Socket } from 'socket.io';

export class PresenceHandler {
  constructor(private io: Server) {}

  handleNoteUpdate(socket: Socket, data: { roomId: string; content: string }) {
    // Notes are private to interviewers — NOT broadcast to candidates
    // In production, persist to database
    console.log(`[Notes] Interviewer ${socket.id} updated notes in ${data.roomId}`);
  }
}
