import { Server } from 'socket.io';
import { createServer } from 'http';
import { RoomHandler } from './handlers/roomHandler';
import { YjsHandler } from './handlers/yjsHandler';
import { SignalingHandler } from './handlers/signalingHandler';
import { ChatHandler } from './handlers/chatHandler';
import { PresenceHandler } from './handlers/presenceHandler';
import { authMiddleware } from './middleware/auth';
import { RoomService } from './services/roomService';

const PORT = Number(process.env.WS_PORT) || 3001;
const CORS_ORIGIN = process.env.WS_CORS_ORIGIN || 'http://localhost:3000';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 30000,
  pingInterval: 10000,
});

// Services
const roomService = new RoomService();

// Handlers
const roomHandler = new RoomHandler(io, roomService);
const yjsHandler = new YjsHandler(roomService);
const signalingHandler = new SignalingHandler(io);
const chatHandler = new ChatHandler(io, roomService);
const presenceHandler = new PresenceHandler(io);

// Auth middleware
io.use(authMiddleware);

// Connection handling
io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);

  // ─── Room Lifecycle ─────────────────────────────
  socket.on('room:join', (data) => roomHandler.handleJoin(socket, data));
  socket.on('room:leave', (data) => roomHandler.handleLeave(socket, data));

  // ─── CRDT / Code Sync ──────────────────────────
  socket.on('yjs:update', (data) => yjsHandler.handleUpdate(socket, data));
  socket.on('yjs:awareness', (data) => yjsHandler.handleAwareness(socket, data));

  // ─── Language Change ────────────────────────────
  socket.on('code:language_change', (data) => {
    socket.to(data.roomId).emit('code:language_changed', {
      language: data.language,
      starterCode: data.starterCode,
      changedBy: socket.id,
    });
  });

  // ─── WebRTC Signaling ──────────────────────────
  socket.on('signal:offer', (data) => signalingHandler.handleOffer(socket, data));
  socket.on('signal:answer', (data) => signalingHandler.handleAnswer(socket, data));
  socket.on('signal:ice', (data) => signalingHandler.handleIce(socket, data));

  // ─── Media Control ─────────────────────────────
  socket.on('media:toggle', (data) => {
    socket.to(data.roomId).emit('media:participant_toggle', {
      userId: (socket.data as any)?.userId || socket.id,
      type: data.type,
      enabled: data.enabled,
    });
  });

  // ─── Chat ──────────────────────────────────────
  socket.on('chat:message', (data) => chatHandler.handleMessage(socket, data));

  // ─── Interview Control ─────────────────────────
  socket.on('interview:set_question', (data) => {
    socket.to(data.roomId).emit('interview:question_set', {
      questionId: data.questionId,
    });
  });

  socket.on('interview:timer_start', (data) => {
    io.in(data.roomId).emit('interview:timer_update', {
      remaining: data.durationSec,
      state: 'running',
    });
  });

  socket.on('interview:timer_pause', (data) => {
    io.in(data.roomId).emit('interview:timer_update', {
      state: 'paused',
    });
  });

  socket.on('interview:end', (data) => {
    io.in(data.roomId).emit('interview:ended', {
      reason: 'interviewer_ended',
      redirectUrl: '/',
    });
    roomHandler.handleEnd(data.roomId);
  });

  // ─── Notes (interviewer private) ────────────────
  socket.on('note:update', (data) => {
    // Notes are NOT broadcast — only persist
    presenceHandler.handleNoteUpdate(socket, data);
  });

  // ─── Code Sync (simple broadcast, candidate → interviewer) ────
  socket.on('code:sync', (data: { roomId: string; code: string }) => {
    socket.to(data.roomId).emit('code:synced', { code: data.code });
  });

  // ─── Output Sync (candidate runs → interviewer sees) ─────────
  socket.on('output:sync', (data: { roomId: string; output: string; submitted: boolean }) => {
    socket.to(data.roomId).emit('output:synced', {
      output: data.output,
      submitted: data.submitted,
    });
  });

  // ─── Integrity / Anti-Cheat Events ───────────────────────────
  socket.on('integrity:event', (data: any) => {
    const { roomId, ...eventData } = data;
    // Only notify interviewers in the room (not back to the candidate)
    const room = roomService.getRoom(roomId);
    if (room) {
      room.participants.forEach((participant: any, socketId: string) => {
        if (participant.role === 'interviewer' && socketId !== socket.id) {
          io.to(socketId).emit('cheat:event', eventData);
        }
      });
    } else {
      // Fallback: broadcast to room (simpler for dev)
      socket.to(roomId).emit('cheat:event', eventData);
    }
  });

  // ─── Disconnect ────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
    roomHandler.handleDisconnect(socket);
  });
});

httpServer.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use.`);
    console.error(`   Run: taskkill /F /IM node.exe   (to kill old processes)`);
    console.error(`   Then try again.\n`);
  } else {
    console.error('[WS] Server error:', err);
  }
});

httpServer.listen(PORT, () => {
  console.log(`\n🚀 WebSocket server running on port ${PORT}`);
  console.log(`   CORS origin: ${CORS_ORIGIN}`);
  console.log(`   Transports: websocket, polling\n`);
});

export { io };
