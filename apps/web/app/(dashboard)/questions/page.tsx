'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, Search, FileQuestion, Tag, Clock, Eye,
  Edit2, Archive, MoreVertical,
} from 'lucide-react';
import { cn, getDifficultyColor } from '@/lib/utils';

const MOCK_QUESTIONS = [
  { id: '1', title: 'Two Sum', difficulty: 'EASY', type: 'CODING', tags: ['arrays', 'hash-map'], testCases: 5, usedCount: 12 },
  { id: '2', title: 'LRU Cache', difficulty: 'MEDIUM', type: 'CODING', tags: ['design', 'hash-map', 'linked-list'], testCases: 8, usedCount: 7 },
  { id: '3', title: 'Merge K Sorted Lists', difficulty: 'HARD', type: 'CODING', tags: ['heap', 'linked-list'], testCases: 6, usedCount: 3 },
  { id: '4', title: 'Valid Parentheses', difficulty: 'EASY', type: 'CODING', tags: ['stack', 'string'], testCases: 4, usedCount: 15 },
  { id: '5', title: 'Binary Tree Level Order', difficulty: 'MEDIUM', type: 'CODING', tags: ['tree', 'bfs'], testCases: 7, usedCount: 9 },
  { id: '6', title: 'Design URL Shortener', difficulty: 'MEDIUM', type: 'SYSTEM_DESIGN', tags: ['system-design'], testCases: 0, usedCount: 5 },
];

export default function QuestionsPage() {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filtered = MOCK_QUESTIONS.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some(t => t.includes(search.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dash-text">Question Bank</h1>
          <p className="text-sm text-dash-muted mt-1">Manage coding challenges and test cases</p>
        </div>
        <Link href="/questions/new" className="btn-primary btn-md">
          <Plus className="w-4 h-4" />
          New Question
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
            placeholder="Search questions or tags..."
            className="input pl-10"
          />
        </div>
        {['all', 'EASY', 'MEDIUM', 'HARD'].map((d) => (
          <button
            key={d}
            onClick={() => setDifficultyFilter(d)}
            className={cn(
              'btn-sm px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              difficultyFilter === d
                ? 'bg-brand-primary text-white'
                : 'bg-white border border-dash-border text-dash-muted hover:border-brand-primary'
            )}
          >
            {d === 'all' ? 'All' : d}
          </button>
        ))}
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link href={`/questions/${q.id}`} className="block card p-5 h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-brand-primary" />
                  <span className={cn('badge text-[10px]', getDifficultyColor(q.difficulty))}>
                    {q.difficulty}
                  </span>
                </div>
                <span className="text-[10px] text-dash-muted uppercase">{q.type.replace('_', ' ')}</span>
              </div>

              <h3 className="text-sm font-semibold text-dash-text mb-2">{q.title}</h3>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {q.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] text-dash-muted">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-dash-muted pt-3 border-t border-dash-border">
                <span>{q.testCases} test cases</span>
                <span>Used {q.usedCount}×</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
