// apps/web/lib/auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/',
    error: '/',
  },
  providers: [
    // Load Google only if real keys are provided (not the placeholder)
    ...(process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.startsWith('YOUR_')
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

    // Load GitHub only if real keys are provided
    ...(process.env.GITHUB_CLIENT_ID && !process.env.GITHUB_CLIENT_ID.startsWith('YOUR_')
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.passwordHash) {
            console.error('[Auth] User not found or no password hash');
            throw new Error('Invalid credentials');
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isValid) {
            console.error('[Auth] Invalid password');
            throw new Error('Invalid credentials');
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl,
            role: user.role,
          };
        } catch (error) {
          console.error('[Auth] Authorize Error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'INTERVIEWER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser && user.email) {
        console.log(`New user signed up: ${user.email}`);
      }
    },
  },
});

// ─── Utility: generate a JWT for WebSocket auth ──────────────────
export function generateWSToken(userId: string, role: string): string {
  return jwt.sign(
    { sub: userId, role },
    process.env.JWT_SECRET || 'dev-jwt-secret',
    { expiresIn: '24h' }
  );
}

// ─── RBAC ────────────────────────────────────────────────────────
export const PERMISSIONS = {
  ADMIN:       ['interview:create', 'interview:schedule', 'interview:cancel', 'question:create', 'question:update', 'candidate:invite', 'feedback:view', 'analytics:view', 'user:manage'],
  RECRUITER:   ['interview:create', 'interview:schedule', 'interview:cancel', 'question:create', 'question:update', 'candidate:invite', 'feedback:view', 'analytics:view'],
  INTERVIEWER: ['interview:join', 'interview:control', 'question:view', 'feedback:submit', 'note:write'],
  CANDIDATE:   ['room:join', 'code:write', 'code:run', 'chat:send', 'video:toggle'],
} as const;

export type Role = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: string): boolean {
  return (PERMISSIONS[role] as readonly string[]).includes(permission);
}
