'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft, Video, Calendar, Clock, User, Copy,
  ExternalLink, Play, FileText, MessageSquare,
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
        className="flex items-center gap-1.5 text-sm text-dash-muted hover:text-dash-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Interviews
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dash-text">{interview.title}</h1>
            <p className="text-sm text-dash-muted mt-1 font-mono">{interview.roomId}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/interviews/${params.id}/replay`}
              className="btn-secondary btn-sm"
            >
              <Play className="w-3.5 h-3.5" />
              Replay
            </Link>
            <Link
              href={`/room/${interview.roomId}`}
              className="btn-primary btn-sm"
            >
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
              <h2 className="text-sm font-semibold text-dash-text mb-4">Interview Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-dash-muted" />
                  <div>
                    <p className="text-xs text-dash-muted">Scheduled</p>
                    <p className="text-sm text-dash-text">{formatDate(interview.scheduledAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-dash-muted" />
                  <div>
                    <p className="text-xs text-dash-muted">Duration</p>
                    <p className="text-sm text-dash-text">{interview.durationMinutes} minutes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-dash-text mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-primary" />
                Assigned Questions
              </h2>
              <div className="space-y-2">
                {interview.questions.map((q, i) => (
                  <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-dash-muted font-mono w-6">{i + 1}.</span>
                      <span className="text-sm font-medium text-dash-text">{q.title}</span>
                    </div>
                    <span className={cn(
                      'badge text-[10px]',
                      q.difficulty === 'EASY' ? 'badge-easy' :
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
              <h2 className="text-sm font-semibold text-dash-text mb-4">Participants</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dash-text">{interview.interviewer.name}</p>
                    <p className="text-[10px] text-dash-muted">Interviewer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dash-text">{interview.candidate.name}</p>
                    <p className="text-[10px] text-dash-muted">Candidate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invite link */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-dash-text mb-3">Invite Link</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={interview.inviteLink}
                  className="input text-xs font-mono truncate"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(interview.inviteLink)}
                  className="btn-ghost p-2 rounded-lg shrink-0"
                >
                  <Copy className="w-4 h-4 text-dash-muted" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
