'use client';

import { motion } from 'framer-motion';
import { Users, Search, Mail, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const MOCK_CANDIDATES = [
  { id: '1', name: 'Alice Johnson', email: 'alice@email.com', interviews: 3, lastInterview: '2 days ago', status: 'active' },
  { id: '2', name: 'Bob Smith', email: 'bob@email.com', interviews: 1, lastInterview: '1 week ago', status: 'active' },
  { id: '3', name: 'Carol Davis', email: 'carol@email.com', interviews: 2, lastInterview: 'Tomorrow', status: 'scheduled' },
  { id: '4', name: 'Dave Wilson', email: 'dave@email.com', interviews: 1, lastInterview: '3 days ago', status: 'completed' },
  { id: '5', name: 'Eve Miller', email: 'eve@email.com', interviews: 4, lastInterview: 'Yesterday', status: 'completed' },
];

export default function CandidatesPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CANDIDATES.filter(c =>
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
            <tr className="border-b border-dash-border bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Candidate</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Interviews</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Last Activity</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-dash-muted uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dash-border">
            {filtered.map((c, i) => (
              <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-white">{c.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dash-text">{c.name}</p>
                      <p className="text-xs text-dash-muted">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-dash-text">{c.interviews}</td>
                <td className="px-5 py-4 text-sm text-dash-muted">{c.lastInterview}</td>
                <td className="px-5 py-4">
                  <span className={cn('badge text-[10px]',
                    c.status === 'active' ? 'bg-blue-100 text-blue-700' :
                    c.status === 'scheduled' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
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
