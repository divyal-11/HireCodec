'use client';

import { motion } from 'framer-motion';
import { Users, Search, Mail, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';



export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/interviews')
      .then(r => r.json())
      .then(data => {
        const ints = data.interviews || [];
        const candMap = new Map();

        ints.forEach((i: any) => {
          const c = i.participants?.find((p: any) => p.role === 'candidate');
          if (!c) return;

          const email = c.user?.email || c.guestEmail || `no-email-${c.guestName || Math.random()}`;
          const name = c.user?.name || c.guestName || 'Unnamed Candidate';

          if (!candMap.has(email)) {
            candMap.set(email, {
              id: email,
              name,
              email: email.startsWith('no-email') ? 'No email provided' : email,
              interviews: 0,
              lastInterview: 'Never',
              status: i.status === 'ACTIVE' ? 'active' : i.status === 'SCHEDULED' ? 'scheduled' : 'completed',
              lastTime: 0,
            });
          }

          const cand = candMap.get(email);
          cand.interviews += 1;
          const iTime = i.scheduledAt ? new Date(i.scheduledAt).getTime() : 0;
          if (iTime > cand.lastTime) {
            cand.lastTime = iTime;
            cand.lastInterview = i.scheduledAt ? new Date(i.scheduledAt).toLocaleDateString() : 'Unscheduled';
          }
          if (i.status === 'ACTIVE') cand.status = 'active'; // Priority status
        });

        setCandidates(Array.from(candMap.values()));
        setLoading(false);
      });
  }, []);

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dash-text">Candidates</h1>
          <p className="text-sm text-dash-muted mt-1">Manage and track interview candidates</p>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dash-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates..." className="input pl-10" />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dash-border bg-dash-surface dark:bg-white/[0.02]">
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Candidate</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Interviews</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Last Activity</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-dash-muted">Loading candidates...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-dash-muted">No candidates found.</td>
              </tr>
            ) : filtered.map((c, i) => (
              <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-dash-bg dark:hover:bg-white/[0.04] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-white">{c.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{c.interviews}</td>
                <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">{c.lastInterview}</td>
                <td className="px-5 py-4">
                  <span className={cn('badge text-[10px]',
                    c.status === 'active'     ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                    c.status === 'scheduled'  ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                    'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                  )}>
                    {c.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
