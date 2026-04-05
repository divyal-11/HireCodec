'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';

const METRICS = [
  { label: 'Total Interviews', value: '156', icon: BarChart3, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
  { label: 'Pass Rate', value: '34%', icon: CheckCircle2, color: 'text-brand-success', bg: 'bg-brand-success/10' },
  { label: 'Avg Score', value: '6.8', icon: TrendingUp, color: 'text-brand-accent', bg: 'bg-brand-accent/10' },
  { label: 'Avg Duration', value: '47m', icon: Clock, color: 'text-brand-warning', bg: 'bg-brand-warning/10' },
];

const TOP_QUESTIONS = [
  { title: 'Two Sum', uses: 24, passRate: '82%' },
  { title: 'LRU Cache', uses: 18, passRate: '44%' },
  { title: 'Valid Parentheses', uses: 15, passRate: '91%' },
  { title: 'Merge K Sorted Lists', uses: 12, passRate: '28%' },
  { title: 'Binary Tree Level Order', uses: 9, passRate: '67%' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-dash-text mb-1">Analytics</h1>
      <p className="text-sm text-dash-muted mb-8">Interview performance metrics and insights</p>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRICS.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart placeholder */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-dash-text mb-4">Interview Trend</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-dash-border">
            <div className="text-center text-dash-muted">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Chart will render with real data</p>
            </div>
          </div>
        </div>

        {/* Top questions */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-dash-text mb-4">Most Used Questions</h2>
          <div className="space-y-3">
            {TOP_QUESTIONS.map((q, i) => (
              <motion.div key={q.title} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-dash-muted w-5">{i + 1}.</span>
                  <span className="text-sm font-medium text-dash-text">{q.title}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-dash-muted">
                  <span>{q.uses} uses</span>
                  <span className="font-medium text-brand-success">{q.passRate} pass</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
