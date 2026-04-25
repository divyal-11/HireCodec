'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Video, FileQuestion, Users, Clock, TrendingUp,
  Calendar, ArrowUpRight, CheckCircle2, Sparkles,
  Play, BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/* ── 3D Tilt Component ────────────────────────── */
function Tilt3D({ children, className, intensity = 4 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 400, damping: 30 });

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const DEFAULT_STATS = [
  { label: 'Total Interviews', value: '0', change: '-', icon: Video, gradient: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20' },
  { label: 'Questions', value: '0', change: '-', icon: FileQuestion, gradient: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
  { label: 'Candidates', value: '0', change: '-', icon: Users, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
  { label: 'Avg. Duration', value: '45m', change: '-', icon: Clock, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
];

const DEFAULT_UPCOMING: any[] = [];
const DEFAULT_RECENT: any[] = [];

const avatarColors = [
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-violet-500 to-fuchsia-500',
  'from-red-500 to-pink-500',
];

export default function DashboardPage() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [upcoming, setUpcoming] = useState(DEFAULT_UPCOMING);
  const [recent, setRecent] = useState(DEFAULT_RECENT);

  useEffect(() => {
    Promise.all([
      fetch('/api/interviews').then(r => r.json().catch(() => ({}))),
      fetch('/api/questions').then(r => r.json().catch(() => {}))
    ]).then(([intsData, qsData]) => {
      const ints = intsData.interviews || [];
      const qs = Array.isArray(qsData) ? qsData : qsData?.questions || [];

      setStats([
        { label: 'Total Interviews', value: ints.length.toString(), change: '+2', icon: Video, gradient: 'from-indigo-500 to-purple-600', shadow: 'shadow-indigo-500/20' },
        { label: 'Questions', value: qs.length.toString(), change: '-', icon: FileQuestion, gradient: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
        { label: 'Candidates', value: ints.length.toString(), change: '+1', icon: Users, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
        { label: 'Avg. Duration', value: '45m', change: '-', icon: Clock, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
      ]);

      const sched = ints.filter((i: any) => i.status === 'SCHEDULED' || i.status === 'ACTIVE').slice(0, 4).map((i: any) => {
        const c = i.participants?.find((p: any) => p.role === 'candidate');
        const cName = c?.user?.name || c?.guestName || 'Candidate';
        const qDiff = i.questions?.[0]?.question?.difficulty || 'MEDIUM';
        return {
          id: i.roomId, // we need roomId to join
          title: i.title,
          candidate: cName,
          time: new Date(i.scheduledAt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          difficulty: qDiff,
          avatar: cName.substring(0, 2).toUpperCase()
        };
      });
      setUpcoming(sched);

      const rec = ints.filter((i: any) => i.status === 'COMPLETED').slice(0, 4).map((i: any) => {
        const c = i.participants?.find((p: any) => p.role === 'candidate');
        const cName = c?.user?.name || c?.guestName || 'Candidate';
        return {
          id: i.id,
          title: i.title,
          candidate: cName,
          score: 8.5, // Mocked pending feedback scoring implementation
          decision: 'yes',
          date: new Date(i.scheduledAt).toLocaleDateString(),
          avatar: cName.substring(0, 2).toUpperCase()
        };
      });
      setRecent(rec);
    });
  }, []);

  return (
    <div className="p-8" style={{ perspective: '1200px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-end justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">Overview</span>
          </div>
          <h1 className="text-3xl font-extrabold text-dash-text dark:text-editor-text tracking-tight">Dashboard</h1>
          <p className="text-sm text-dash-muted dark:text-editor-comment mt-1">Welcome back! Here&apos;s your interview overview.</p>
        </div>
        <Link
          href="/interviews/new"
          className="btn-primary btn-md hidden sm:flex"
        >
          <Play className="w-4 h-4" />
          New Interview
        </Link>
      </motion.div>

      {/* 3D Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tilt3D className="card-3d p-5 cursor-default group" intensity={5}>
              <div className="flex items-start justify-between" style={{ transform: 'translateZ(20px)' }}>
                <div>
                  <p className="text-xs text-dash-muted dark:text-editor-comment font-semibold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-dash-text dark:text-editor-text mt-2 tracking-tight">{stat.value}</p>
                </div>
                <div className={cn(
                  'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3',
                  stat.gradient, stat.shadow
                )}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-dash-border/50 dark:border-editor-border/50" style={{ transform: 'translateZ(10px)' }}>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                  <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{stat.change}</span>
                </div>
                <span className="text-xs text-dash-muted dark:text-editor-comment">vs last month</span>
              </div>
            </Tilt3D>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Interviews — 3D */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tilt3D className="card-3d overflow-hidden" intensity={2}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-dash-border/50 dark:border-editor-border/50">
              <h2 className="text-sm font-bold text-dash-text dark:text-editor-text flex items-center gap-2.5 uppercase tracking-wider">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                Upcoming Interviews
              </h2>
              <Link href="/interviews" className="text-xs text-brand-primary hover:text-brand-primary-dark flex items-center gap-0.5 font-bold transition-colors">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-dash-border/30 dark:divide-editor-border/30">
              {upcoming.length === 0 ? <p className="p-6 text-sm text-dash-muted">No upcoming interviews.</p> : upcoming.map((interview, i) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-center px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-editor-surface/50 transition-all duration-200 group cursor-pointer"
                >
                  {/* Avatar */}
                  <div className={cn(
                    'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md mr-4 shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300',
                    avatarColors[i % avatarColors.length]
                  )}>
                    <span className="text-xs font-bold text-white">{interview.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dash-text dark:text-editor-text truncate">{interview.title}</p>
                    <p className="text-xs text-dash-muted dark:text-editor-comment">{interview.candidate}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-dash-text dark:text-editor-text font-medium">{interview.time}</p>
                    <span className={cn(
                      'badge mt-1 text-[10px]',
                      interview.difficulty === 'HARD' ? 'badge-hard' :
                      interview.difficulty === 'MEDIUM' ? 'badge-medium' : 'badge-easy'
                    )}>
                      {interview.difficulty}
                    </span>
                  </div>
                  <Link
                    href={`/room/${interview.id}`}
                    className="ml-4 btn-primary btn-sm text-[11px] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
                  >
                    Join
                  </Link>
                </motion.div>
              ))}
            </div>
          </Tilt3D>
        </motion.div>

        {/* Recent Results — 3D */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tilt3D className="card-3d overflow-hidden" intensity={3}>
            <div className="px-6 py-5 border-b border-dash-border/50 dark:border-editor-border/50">
              <h2 className="text-sm font-bold text-dash-text dark:text-editor-text flex items-center gap-2.5 uppercase tracking-wider">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                Recent Results
              </h2>
            </div>
            <div className="divide-y divide-dash-border/30 dark:divide-editor-border/30">
              {recent.length === 0 ? <p className="p-6 text-sm text-dash-muted">No recent interviews.</p> : recent.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-editor-surface/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-all duration-300',
                        avatarColors[(i + 4) % avatarColors.length]
                      )}>
                        <span className="text-xs font-bold text-white">{r.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dash-text dark:text-editor-text">{r.candidate}</p>
                        <p className="text-xs text-dash-muted dark:text-editor-comment">{r.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-xl font-extrabold',
                        r.score >= 7 ? 'text-emerald-500' :
                        r.score >= 5 ? 'text-amber-500' : 'text-red-500'
                      )}>
                        {r.score}
                      </p>
                      <span className={cn(
                        'text-[10px] font-bold uppercase tracking-wider',
                        r.decision === 'strong_yes' ? 'text-emerald-500' :
                        r.decision === 'yes' ? 'text-emerald-400' : 'text-red-500'
                      )}>
                        {r.decision.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-dash-muted dark:text-editor-comment mt-2 ml-13">{r.date}</p>
                </motion.div>
              ))}
            </div>
          </Tilt3D>
        </motion.div>
      </div>
    </div>
  );
}
