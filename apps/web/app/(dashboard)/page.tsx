'use client';

import { motion } from 'framer-motion';
import {
  Video, FileQuestion, Users, Clock, TrendingUp,
  Calendar, ArrowUpRight, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const STATS = [
  { label: 'Total Interviews', value: '47', change: '+12%', icon: Video, color: 'text-brand-primary' },
  { label: 'Questions', value: '128', change: '+5', icon: FileQuestion, color: 'text-brand-accent' },
  { label: 'Candidates', value: '89', change: '+8%', icon: Users, color: 'text-brand-success' },
  { label: 'Avg. Duration', value: '42m', change: '-3m', icon: Clock, color: 'text-brand-warning' },
];

const UPCOMING = [
  {
    id: '1', title: 'Senior Frontend Engineer', candidate: 'Alice Johnson',
    time: 'Today, 2:00 PM', status: 'SCHEDULED', difficulty: 'HARD',
  },
  {
    id: '2', title: 'Backend Developer', candidate: 'Bob Smith',
    time: 'Today, 4:30 PM', status: 'SCHEDULED', difficulty: 'MEDIUM',
  },
  {
    id: '3', title: 'Full Stack Engineer', candidate: 'Carol Davis',
    time: 'Tomorrow, 10:00 AM', status: 'SCHEDULED', difficulty: 'MEDIUM',
  },
  {
    id: '4', title: 'DevOps Engineer', candidate: 'Dave Wilson',
    time: 'Tomorrow, 2:00 PM', status: 'SCHEDULED', difficulty: 'EASY',
  },
];

const RECENT = [
  {
    id: '5', title: 'ML Engineer', candidate: 'Eve Miller', status: 'COMPLETED',
    score: 8.5, decision: 'strong_yes', date: 'Yesterday',
  },
  {
    id: '6', title: 'Frontend Developer', candidate: 'Frank Brown', status: 'COMPLETED',
    score: 6.2, decision: 'yes', date: '2 days ago',
  },
  {
    id: '7', title: 'Backend Engineer', candidate: 'Grace Lee', status: 'COMPLETED',
    score: 4.1, decision: 'no', date: '3 days ago',
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dash-text">Dashboard</h1>
        <p className="text-sm text-dash-muted mt-1">Welcome back! Here&apos;s your interview overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-dash-muted font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-dash-text mt-1">{stat.value}</p>
              </div>
              <div className={cn('p-2 rounded-lg bg-gray-50', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-3 h-3 text-brand-success" />
              <span className="text-xs text-brand-success font-medium">{stat.change}</span>
              <span className="text-xs text-dash-muted">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Interviews */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-dash-border">
              <h2 className="text-sm font-semibold text-dash-text flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                Upcoming Interviews
              </h2>
              <Link href="/interviews" className="text-xs text-brand-primary hover:underline flex items-center gap-0.5">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-dash-border">
              {UPCOMING.map((interview, i) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-center px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dash-text truncate">{interview.title}</p>
                    <p className="text-xs text-dash-muted">{interview.candidate}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-dash-text">{interview.time}</p>
                    <span className={cn(
                      'badge mt-0.5 text-[10px]',
                      interview.difficulty === 'HARD' ? 'badge-hard' :
                      interview.difficulty === 'MEDIUM' ? 'badge-medium' : 'badge-easy'
                    )}>
                      {interview.difficulty}
                    </span>
                  </div>
                  <Link
                    href={`/interviews/${interview.id}`}
                    className="ml-4 btn-sm px-3 py-1.5 rounded-lg text-[11px] bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 font-medium transition-colors"
                  >
                    Join
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div>
          <div className="card">
            <div className="px-5 py-4 border-b border-dash-border">
              <h2 className="text-sm font-semibold text-dash-text flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-success" />
                Recent Results
              </h2>
            </div>
            <div className="divide-y divide-dash-border">
              {RECENT.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="px-5 py-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dash-text">{r.candidate}</p>
                      <p className="text-xs text-dash-muted">{r.title}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-lg font-bold',
                        r.score >= 7 ? 'text-brand-success' :
                        r.score >= 5 ? 'text-brand-warning' : 'text-brand-danger'
                      )}>
                        {r.score}
                      </p>
                      <span className={cn(
                        'text-[10px] font-medium uppercase',
                        r.decision === 'strong_yes' ? 'text-brand-success' :
                        r.decision === 'yes' ? 'text-emerald-400' :
                        r.decision === 'no' ? 'text-brand-danger' : 'text-red-600'
                      )}>
                        {r.decision.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-dash-muted mt-1">{r.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
