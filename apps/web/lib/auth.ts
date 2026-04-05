// lib/auth.ts — Authentication config & RBAC

import jwt from 'jsonwebtoken';

export const PERMISSIONS = {
  ADMIN: [
    'interview:create', 'interview:schedule', 'interview:cancel',
    'question:create', 'question:update', 'candidate:invite',
    'feedback:view', 'analytics:view', 'user:manage', 'org:manage',
  ],
  RECRUITER: [
    'interview:create', 'interview:schedule', 'interview:cancel',
    'question:create', 'question:update', 'candidate:invite',
    'feedback:view', 'analytics:view',
  ],
  INTERVIEWER: [
    'interview:join', 'interview:control', 'question:view',
    'feedback:submit', 'note:write',
  ],
  CANDIDATE: [
    'room:join', 'code:write', 'code:run', 'chat:send',
    'video:toggle',
  ],
} as const;

export type Role = keyof typeof PERMISSIONS;
export type Permission = typeof PERMISSIONS[Role][number];

export function hasPermission(role: Role, permission: string): boolean {
  return (PERMISSIONS[role] as readonly string[]).includes(permission);
}

export function generateInviteToken(payload: {
  interviewId: string;
  guestName: string;
  guestEmail: string;
}): string {
  return jwt.sign(
    { ...payload, type: 'invite' },
    process.env.INTERVIEW_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
}

export function validateInviteToken(token: string): {
  interviewId: string;
  guestName: string;
  guestEmail: string;
} {
  const payload = jwt.verify(
    token,
    process.env.INTERVIEW_SECRET || 'dev-secret'
  ) as any;
  return payload;
}

export function generateJWT(userId: string, role: string): string {
  return jwt.sign(
    { sub: userId, role },
    process.env.JWT_SECRET || 'dev-jwt-secret',
    { expiresIn: '24h' }
  );
}

export function verifyJWT(token: string): { sub: string; role: string } {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'dev-jwt-secret'
  ) as any;
}
