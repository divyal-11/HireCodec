'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Video, Calendar, Clock, User, Copy,
  Play, FileText,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

// Mock data
const INTERVIEW = {
  id: '1',
  title: 'Senior Frontend Engineer',
  roomId: 'abc-xyz-123',
  status: 'SCHEDULED',
  scheduledAt: '2026-04-06T14:00:00Z',
  durationMinutes: 60,
  candidate: { name: 'Alice Johnson', email: 'alice@email.com' },
  interviewer: { name: 'John Doe', email: 'john@company.com' },
  questions: [
    { id: '1', title: 'Two Sum', difficulty: 'EASY' },
    { id: '2', title: 'LRU Cache', difficulty: 'MEDIUM' },
  ],
  inviteLink: 'https://hirecodec.com/join/abc-xyz-123?token=eyJ...',
};

export default function InterviewDetailPage({ params }: { params: { id: string } }) {
  const interview = INTERVIEW;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/interviews"
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Interviews
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{interview.title}</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 font-mono">{interview.roomId}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/interviews/${params.id}/replay`} className="btn-secondary btn-sm">
              <Play className="w-3.5 h-3.5" />
              Replay
            </Link>
            <Link href={`/room/${interview.roomId}`} className="btn-primary btn-sm">
              <Video className="w-3.5 h-3.5" />
              Join Room
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main info */}
          <div className="col-span-2 space-y-6">

            {/* Details card */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Interview Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatDate(interview.scheduledAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{interview.durationMinutes} minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                Assigned Questions
              </h2>
              <div className="space-y-2">
                {interview.questions.map((q, i) => (
                  <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/[0.04] border border-transparent dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono w-6">{i + 1}.</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{q.title}</span>
                    </div>
                    <span className={cn(
                      'badge text-[10px]',
                      q.difficulty === 'EASY'   ? 'badge-easy' :
                      q.difficulty === 'MEDIUM' ? 'badge-medium' : 'badge-hard'
                    )}>
                      {q.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Participants */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Participants</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{interview.interviewer.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Interviewer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{interview.candidate.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Candidate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invite link */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Invite Link</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={interview.inviteLink}
                  className="input text-xs font-mono truncate"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(interview.inviteLink)}
                  className="btn-ghost p-2 rounded-lg shrink-0 text-gray-400 hover:text-gray-200"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
