import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [3, 4, 3];
  return segments
    .map((len) =>
      Array.from({ length: len }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    )
    .join('-');
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty.toUpperCase()) {
    case 'EASY':
      return 'text-emerald-500 bg-emerald-500/10';
    case 'MEDIUM':
      return 'text-amber-500 bg-amber-500/10';
    case 'HARD':
      return 'text-red-500 bg-red-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'ACCEPTED':
      return 'text-emerald-400';
    case 'WRONG_ANSWER':
      return 'text-red-400';
    case 'TIME_LIMIT_EXCEEDED':
    case 'MEMORY_LIMIT_EXCEEDED':
      return 'text-amber-400';
    case 'RUNTIME_ERROR':
    case 'COMPILATION_ERROR':
      return 'text-red-400';
    case 'PENDING':
    case 'RUNNING':
      return 'text-blue-400';
    default:
      return 'text-gray-400';
  }
}
