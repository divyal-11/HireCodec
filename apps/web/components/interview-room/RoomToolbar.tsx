'use client';

import { Code2, Clock, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SUPPORTED_LANGUAGES } from '@hire-codec/shared';
import type { Language } from '@hire-codec/shared';
import type { UseTimerReturn } from '@/hooks/useTimer';

interface RoomToolbarProps {
  roomId: string;
  role: string;
  timer: {
    formattedTime: string;
    timerState: string;
    isWarning: boolean;
    isCritical: boolean;
    startTimer: (sec: number) => void;
    pauseTimer: () => void;
  };
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onEndInterview: () => void;
}

export function RoomToolbar({
  roomId,
  role,
  timer,
  language,
  onLanguageChange,
  onEndInterview,
}: RoomToolbarProps) {
  return (
    <header className="flex items-center h-12 px-4 bg-editor-surface border-b border-editor-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
          <Code2 className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-editor-text hidden sm:block">
          Hire<span className="text-brand-primary">Codec</span>
        </span>
      </div>

      {/* Room ID */}
      <div className="px-2 py-1 rounded bg-editor-bg border border-editor-border text-[10px] font-mono text-editor-comment mr-3">
        {roomId}
      </div>

      <div className="flex-1" />

      {/* Timer */}
      <div
        className={cn(
          'flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-sm font-bold mr-3 transition-colors',
          timer.timerState === 'idle' && 'text-editor-comment',
          timer.timerState === 'running' && !timer.isWarning && !timer.isCritical && 'text-editor-text',
          timer.isWarning && 'text-brand-warning',
          timer.isCritical && 'text-brand-danger animate-pulse'
        )}
      >
        <Clock className="w-3.5 h-3.5" />
        {timer.formattedTime || '--:--'}
      </div>

      {/* Language selector */}
      <div className="relative mr-3">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="appearance-none bg-editor-bg border border-editor-border rounded-lg pl-3 pr-7 py-1.5 text-xs text-editor-text cursor-pointer focus:outline-none focus:border-brand-primary"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-editor-comment pointer-events-none" />
      </div>

      {/* Interviewer controls */}
      {role === 'interviewer' && (
        <div className="flex items-center gap-2">
          {timer.timerState === 'idle' && (
            <button
              onClick={() => timer.startTimer(3600)}
              className="btn-sm px-3 py-1 rounded-md text-[11px] bg-editor-bg border border-editor-border text-editor-text hover:bg-editor-border transition-colors"
            >
              Start Timer
            </button>
          )}

          <button
            onClick={onEndInterview}
            className="btn-sm flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] bg-brand-danger/10 text-brand-danger border border-brand-danger/20 hover:bg-brand-danger/20 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            End
          </button>
        </div>
      )}
    </header>
  );
}
