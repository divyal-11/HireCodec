'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Code2, Search, Filter, BookOpen, Tag, ChevronRight,
  Zap, Clock, Trophy, ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { cn, getDifficultyColor } from '@/lib/utils';

import { PRACTICE_QUESTIONS as QUESTIONS } from '@/lib/practice-questions';

const DIFFICULTIES = ['All', 'EASY', 'MEDIUM', 'HARD'];
const DIFFICULTY_COLORS = {
  'EASY':   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'MEDIUM': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'HARD':   'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function PracticePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');

  const filtered = QUESTIONS.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
                        q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff   = difficulty === 'All' || q.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  return (
    <div className="min-h-screen bg-editor-bg text-editor-text">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-editor-border bg-editor-bg/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-editor-comment hover:text-editor-text transition-colors text-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span className="text-editor-border">|</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold">Practice <span className="text-brand-primary">Arena</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-editor-comment">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{QUESTIONS.length} problems</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">
            Sharpen your skills
          </h1>
          <p className="text-sm text-editor-comment">
            Practice coding problems solo — the same questions used in real HireCodec interviews.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-editor-comment" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or tag…"
              className="w-full bg-editor-surface border border-editor-border rounded-xl pl-9 pr-4 py-2 text-sm text-editor-text placeholder:text-editor-comment/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-editor-surface border border-editor-border rounded-xl p-1">
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-semibold transition-all',
                  difficulty === d
                    ? 'bg-brand-primary/20 text-brand-primary'
                    : 'text-editor-comment hover:text-editor-text'
                )}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Grid */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-editor-comment">
              <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No problems match your search.</p>
            </div>
          )}
          {filtered.map((q, i) => (
            <div
              key={q.id}
              onClick={() => router.push(`/room/practice-${q.id}?role=candidate&name=Practice&qid=${q.id}`)}
              className="group flex items-center gap-5 p-5 bg-editor-surface border border-editor-border rounded-2xl hover:border-brand-primary/40 hover:bg-brand-primary/5 cursor-pointer transition-all"
            >
              {/* Number */}
              <span className="text-xl font-bold text-editor-border/40 w-6 text-right shrink-0">{i + 1}</span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-editor-text group-hover:text-white transition-colors text-sm">{q.title}</h2>
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', DIFFICULTY_COLORS[q.difficulty as keyof typeof DIFFICULTY_COLORS])}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-xs text-editor-comment mb-2 truncate">{q.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {q.tags.map(t => (
                    <span key={t} className="flex items-center gap-0.5 text-[10px] text-editor-comment bg-editor-bg px-2 py-0.5 rounded-md border border-editor-border">
                      <Tag className="w-2.5 h-2.5" />{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="shrink-0 flex flex-col items-end gap-1 text-xs text-editor-comment">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />{q.timeEst}
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">{q.solveRate}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-editor-border group-hover:text-brand-primary transition-colors shrink-0" />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-editor-comment/40 mt-10">
          Practice sessions are private and not saved to your profile.
        </p>
      </main>
    </div>
  );
}
