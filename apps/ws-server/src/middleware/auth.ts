import type { Socket, ExtendedError } from 'socket.io';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

export function authMiddleware(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
  const token = socket.handshake.auth?.token;

  // Allow dev connections without token
  if (process.env.NODE_ENV === 'development' && !token) {
    (socket.data as any).userId = `dev-${socket.id}`;
    (socket.data as any).role = 'interviewer';
    (socket.data as any).userName = 'Dev User';
    return next();
  }

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    (socket.data as any).userId = payload.sub;
    (socket.data as any).role = payload.role;
    (socket.data as any).userName = payload.name;
    next();
  } catch {
    // Try as invite token
    try {
      const invitePayload = jwt.verify(
        token,
        process.env.INTERVIEW_SECRET || 'dev-secret'
      ) as any;
      (socket.data as any).userId = `guest-${socket.id}`;
      (socket.data as any).role = 'candidate';
      (socket.data as any).userName = invitePayload.guestName;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  }
}
