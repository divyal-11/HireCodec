import type { Socket, ExtendedError } from 'socket.io';

const windowMs = 60_000; // 1 minute
const maxRequests = 100;

const clients = new Map<string, { count: number; resetAt: number }>();

export function rateLimitMiddleware(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
  const ip = socket.handshake.address;
  const now = Date.now();

  const entry = clients.get(ip);
  if (!entry || now > entry.resetAt) {
    clients.set(ip, { count: 1, resetAt: now + windowMs });
    return next();
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return next(new Error('Rate limit exceeded'));
  }

  next();
}
