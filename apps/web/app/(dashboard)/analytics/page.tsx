'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, CheckCircle2, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState({
    total: 0,
    completed: 0,
    passRate: '—',
    avgDuration: '—',
  });
  const [topQuestions, setTopQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/interviews')
      .then((r) => r.json())
      .then((data) => {
        const all = data.interviews || [];
        const completed = all.filter((i: any) => i.status === 'COMPLETED');

        // Question usage count
        const qMap = new Map<string, { title: string; uses: number }>();
        all.forEach((i: any) => {
          i.questions?.forEach((iq: any) => {
            const title = iq.question?.title || 'Unknown';
            const id = iq.question?.id || title;
            qMap.set(id, { title, uses: (qMap.get(id)?.uses || 0) + 1 });
          });
        });

        const sortedQ = Array.from(qMap.values())
          .sort((a, b) => b.uses - a.uses)
          .slice(0, 5);

        setMetrics({
          total: all.length,
          completed: completed.length,
          passRate: all.length > 0
            ? `${Math.round((completed.length / all.length) * 100)}%`
            : '—',
          avgDuration: completed.length > 0 ? '~60m' : '—',
        });
        setTopQuestions(sortedQ);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const METRIC_CARDS = [
    { label: 'Total Interviews', value: metrics.total, icon: BarChart3, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    { label: 'Completed', value: metrics.completed, icon: CheckCircle2, color: 'text-brand-success', bg: 'bg-brand-success/10' },
    { label: 'Completion Rate', value: metrics.passRate, icon: TrendingUp, color: 'text-brand-accent', bg: 'bg-brand-accent/10' },
    { label: 'Avg Duration', value: metrics.avgDuration, icon: Clock, color: 'text-brand-warning', bg: 'bg-brand-warning/10' },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-dash-text mb-1">Analytics</h1>
        <p className="text-sm text-dash-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-dash-text mb-1">Analytics</h1>
      <p className="text-sm text-dash-muted mb-8">Interview performance metrics and insights</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRIC_CARDS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${m.bg}`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-xs text-dash-muted">{m.label}</p>
                <p className="text-2xl font-bold text-dash-text">{m.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {topQuestions.length > 0 && (
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-dash-text mb-4">
            Top Questions Used
          </h2>
          <div className="space-y-3">
            {topQuestions.map((q, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-dash-border last:border-0">
                <span className="text-sm text-dash-text">{q.title}</span>
                <span className="text-xs text-dash-muted">{q.uses} use{q.uses !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topQuestions.length === 0 && (
        <div className="card p-8 text-center text-dash-muted text-sm">
          No interview data yet. Schedule and complete interviews to see analytics.
        </div>
      )}
    </div>
  );
}
