'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, User, Mail, FileQuestion, Plus,
  Trash2, ArrowLeft, Send,
} from 'lucide-react';
import Link from 'next/link';
import { cn, generateRoomId } from '@/lib/utils';

export default function NewInterviewPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    scheduledDate: '',
    scheduledTime: '',
    durationMinutes: 60,
    candidateName: '',
    candidateEmail: '',
    interviewerName: '',
    selectedQuestions: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dbDateStr = form.scheduledDate && form.scheduledTime 
        ? `${form.scheduledDate}T${form.scheduledTime}:00Z` 
        : null;

      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          scheduledAt: dbDateStr,
          durationMinutes: form.durationMinutes,
          candidateName: form.candidateName,
          candidateEmail: form.candidateEmail,
          interviewerName: form.interviewerName,
          questionIds: form.selectedQuestions,
        }),
      });

      if (!res.ok) throw new Error('Failed to create interview');
      
      router.push('/interviews');
    } catch (err) {
      console.error(err);
      alert('Failed to schedule the interview. Please check console.');
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link
        href="/interviews"
        className="flex items-center gap-1.5 text-sm text-dash-muted hover:text-dash-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Interviews
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-dash-text mb-1">Schedule Interview</h1>
        <p className="text-sm text-dash-muted mb-8">
          Set up a new technical interview session with a candidate.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Interview Details */}
          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-dash-text mb-4">Interview Details</h2>
            
            <div>
              <label className="text-xs font-medium text-dash-muted mb-1.5 block">Interview Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., Senior Frontend Engineer — Round 2"
                className="input"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1.5 block">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted" />
                  <input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1.5 block">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted" />
                  <input
                    type="time"
                    value={form.scheduledTime}
                    onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1.5 block">Duration</label>
                <select
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                  className="input"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidate */}
          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-dash-text mb-4">Candidate Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1.5 block">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted" />
                  <input
                    type="text"
                    value={form.candidateName}
                    onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
                    placeholder="Candidate name"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted" />
                  <input
                    type="email"
                    value={form.candidateEmail}
                    onChange={(e) => setForm({ ...form, candidateEmail: e.target.value })}
                    placeholder="candidate@email.com"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interviewer */}
          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-dash-text mb-4">Your Details</h2>
            <div>
              <label className="text-xs font-medium text-dash-muted mb-1.5 block">Your Name (shown in the email)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted" />
                <input
                  type="text"
                  value={form.interviewerName}
                  onChange={(e) => setForm({ ...form, interviewerName: e.target.value })}
                  placeholder="e.g., Divya Surse"
                  className="input pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/interviews" className="btn-secondary btn-md">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary btn-md">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Schedule & Send Invite
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
