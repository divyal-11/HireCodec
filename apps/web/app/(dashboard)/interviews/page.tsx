'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, Video, Calendar,
  Clock, Users, MoreVertical, ExternalLink,
} from 'lucide-react';
import { cn, formatDate, getDifficultyColor } from '@/lib/utils';

const MOCK_INTERVIEWS = [
  {
    id: '1', title: 'Senior Frontend Engineer', roomId: 'abc-xyz-123',
    status: 'SCHEDULED', scheduledAt: '2026-04-06T14:00:00Z', durationMinutes: 60,
    candidate: 'Alice Johnson', interviewer: 'John Doe', questions: 2,
  },
  {
    id: '2', title: 'Backend Developer', roomId: 'def-uvw-456',
    status: 'ACTIVE', scheduledAt: '2026-04-05T16:30:00Z', durationMinutes: 45,
    candidate: 'Bob Smith', interviewer: 'Jane Doe', questions: 3,
  },
  {
    id: '3', title: 'Full Stack Engineer', roomId: 'ghi-rst-789',
    status: 'COMPLETED', scheduledAt: '2026-04-04T10:00:00Z', durationMinutes: 60,
    candidate: 'Carol Davis', interviewer: 'John Doe', questions: 2,
  },
  {
    id: '4', title: 'DevOps Engineer', roomId: 'jkl-opq-012',
    status: 'SCHEDULED', scheduledAt: '2026-04-07T14:00:00Z', durationMinutes: 60,
    candidate: 'Dave Wilson', interviewer: 'Jane Doe', questions: 1,
  },
  {
    id: '5', title: 'ML Engineer', roomId: 'mno-lmn-345',
    status: 'COMPLETED', scheduledAt: '2026-04-03T09:00:00Z', durationMinutes: 90,
    candidate: 'Eve Miller', interviewer: 'John Doe', questions: 4,
  },
];

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-700',
    ACTIVE: 'bg-emerald-100 text-emerald-700 animate-pulse',
    COMPLETED: 'bg-gray-100 text-gray-600',
    CANCELLED: 'bg-red-100 text-red-600',
    WAITING: 'bg-amber-100 text-amber-700',
  };
  return styles[status] || 'bg-gray-100 text-gray-600';
}

export default function InterviewsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = MOCK_INTERVIEWS.filter((i) => {
    const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.candidate.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dash-text">Interviews</h1>
          <p className="text-sm text-dash-muted mt-1">Manage and schedule technical interviews</p>
        </div>
        <Link href="/interviews/new" className="btn-primary btn-md">
          <Plus className="w-4 h-4" />
          New Interview
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interviews or candidates..."
            className="input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="all">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Interview List */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dash-border bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Interview</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Candidate</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Schedule</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {filtered.map((interview, i) => (
              <motion.tr
                key={interview.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dash-text">{interview.title}</p>
                      <p className="text-[11px] text-dash-muted font-mono">{interview.roomId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-dash-text">{interview.candidate}</p>
                  <p className="text-xs text-dash-muted">{interview.interviewer}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-dash-text">
                    <Calendar className="w-3.5 h-3.5 text-dash-muted" />
                    {formatDate(interview.scheduledAt)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-dash-muted mt-0.5">
                    <Clock className="w-3 h-3" />
                    {interview.durationMinutes} min
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={cn('badge', statusBadge(interview.status))}>
                    {interview.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {interview.status === 'ACTIVE' && (
                      <Link
                        href={`/room/${interview.roomId}`}
                        className="btn-sm px-3 py-1 rounded-md text-[11px] bg-brand-success/10 text-brand-success hover:bg-brand-success/20 font-medium"
                      >
                        Join Live
                      </Link>
                    )}
                    <Link
                      href={`/interviews/${interview.id}`}
                      className="btn-ghost p-1.5 rounded-md text-dash-muted hover:text-dash-text"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
