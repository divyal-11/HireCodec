// lib/yjs/awareness.ts — Cursor + Presence awareness

import { Awareness } from 'y-protocols/awareness';

export interface AwarenessUser {
  id: string;
  name: string;
  role: string;
}

export interface AwarenessState {
  user: {
    name: string;
    color: string;
    role: string;
  };
  cursor?: {
    lineNumber: number;
    column: number;
    selectionStartLineNumber?: number;
    selectionStartColumn?: number;
    selectionEndLineNumber?: number;
    selectionEndColumn?: number;
  };
}

const CURSOR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#FF8A5B', '#5B9BD5',
  '#9B59B6', '#1ABC9C', '#E74C3C', '#3498DB',
];

export function generateUserColor(userId: string): string {
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}

export function setupAwareness(awareness: Awareness, user: AwarenessUser): void {
  // Set local user state
  awareness.setLocalStateField('user', {
    name: user.name,
    color: generateUserColor(user.id),
    role: user.role,
  });
}

export function updateCursorPosition(
  awareness: Awareness,
  cursor: AwarenessState['cursor']
): void {
  awareness.setLocalStateField('cursor', cursor);
}

export function getRemoteStates(awareness: Awareness): Map<number, AwarenessState> {
  const states = new Map<number, AwarenessState>();
  awareness.getStates().forEach((state, clientId) => {
    if (clientId !== awareness.clientID && state.user) {
      states.set(clientId, state as AwarenessState);
    }
  });
  return states;
}
