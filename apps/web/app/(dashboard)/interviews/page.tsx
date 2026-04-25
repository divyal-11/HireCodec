'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, Search, Filter, Video, Calendar,
  Clock, Users, MoreVertical, ExternalLink,
} from 'lucide-react';
import { cn, formatDate, getDifficultyColor } from '@/lib/utils';



function statusBadge(status: string) {
  const styles: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 animate-pulse',
    COMPLETED: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400',
    CANCELLED: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    WAITING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  };
  return styles[status] || 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400';
}

export default function InterviewsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from DB
  useEffect(() => {
    setLoading(true);
    fetch('/api/interviews')
      .then(res => res.json())
      .then(data => {
        setInterviews(data.interviews || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getCandidateName = (i: any) => {
    const c = i.participants?.find((p: any) => p.role === 'candidate');
    return c?.user?.name || c?.guestName || 'Unnamed Candidate';
  };

  const getInterviewerName = (i: any) => {
    const int = i.participants?.find((p: any) => p.role === 'interviewer');
    return int?.user?.name || 'Interviewer';
  };

  const filtered = interviews.filter((i) => {
    const candidateName = getCandidateName(i).toLowerCase();
    const titleMatch = i.title.toLowerCase().includes(search.toLowerCase());
    const candidateMatch = candidateName.includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    return (titleMatch || candidateMatch) && matchesStatus;
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
        <tr className="border-b border-dash-border bg-dash-surface dark:bg-white/[0.02]">
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Interview</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Candidate</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Schedule</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-dash-muted">Loading interviews...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-dash-muted">No interviews found.</td>
              </tr>
            ) : filtered.map((interview, i) => (
              <motion.tr
                key={interview.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-dash-bg dark:hover:bg-white/[0.04] transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{interview.title}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">{interview.roomId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{getCandidateName(interview)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{getInterviewerName(interview)}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    {formatDate(interview.scheduledAt)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
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
                    {(interview.status === 'ACTIVE' || interview.status === 'SCHEDULED') && (
                      <>
                        <Link
                          href={`/room/${interview.roomId}`}
                          className="btn-sm px-3 py-1 rounded-md text-[11px] bg-brand-success/10 text-brand-success hover:bg-brand-success/20 font-medium"
                        >
                          Join Live
                        </Link>
                        <button
                          onClick={() => {
                            const candidateUrl = `${window.location.origin}/room/${interview.roomId}?token=${interview.inviteToken || ''}`;
                            navigator.clipboard.writeText(candidateUrl);
                            alert('Candidate link copied!');
                          }}
                          className="btn-sm px-3 py-1 rounded-md text-[11px] bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 font-medium"
                        >
                          Copy Link
                        </button>
                      </>
                    )}
                    <Link
                      href={`/interviews/${interview.id}`}
                      className="btn-ghost p-1.5 rounded-md text-gray-400 hover:text-gray-200"
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
