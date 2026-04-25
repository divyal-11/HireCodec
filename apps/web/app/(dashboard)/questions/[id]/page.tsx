'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Edit2, Trash2, Play, Copy, Clock, Users,
  Tag, CheckCircle2, Code2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { cn, getDifficultyColor } from '@/lib/utils';

/* ─── Extended question data (first 3 full, rest fallback) ── */
const QUESTIONS_DATA: Record<string, any> = {
  '1': {
    title: 'Two Sum', difficulty: 'EASY', type: 'CODING',
    tags: ['arrays', 'hash-map'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Only one valid answer exists.'],
    starterCode: `def twoSum(nums, target):\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]', status: 'pass' },
      { input: '[3,2,4], 6', expected: '[1,2]', status: 'pass' },
      { input: '[3,3], 6', expected: '[0,1]', status: 'pass' },
      { input: '[1,5,3,7], 8', expected: '[1,2]', status: 'pending' },
      { input: '[-1,-2,-3,-4,-5], -8', expected: '[2,4]', status: 'pending' },
    ],
    usedCount: 12, avgTime: '8m 32s', passRate: '78%',
  },
  '2': {
    title: 'LRU Cache', difficulty: 'MEDIUM', type: 'CODING',
    tags: ['design', 'hash-map', 'linked-list'],
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the \`LRUCache\` class:\n- \`LRUCache(int capacity)\` — Initialize the LRU cache with positive size capacity.\n- \`int get(int key)\` — Return the value of the key if it exists, otherwise return -1.\n- \`void put(int key, int value)\` — Update or insert the key-value pair. If the number of keys exceeds capacity, evict the least recently used key.`,
    examples: [
      { input: 'LRUCache(2), put(1,1), put(2,2), get(1)', output: '1', explanation: '' },
    ],
    constraints: ['1 ≤ capacity ≤ 3000', '0 ≤ key ≤ 10⁴', '0 ≤ value ≤ 10⁵', 'At most 2 × 10⁵ calls to get and put.'],
    starterCode: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass`,
    testCases: [
      { input: 'LRUCache(2), put(1,1), put(2,2), get(1)', expected: '1', status: 'pass' },
      { input: 'LRUCache(2), put(1,1), put(2,2), put(3,3), get(2)', expected: '-1', status: 'pass' },
      { input: 'LRUCache(1), put(1,1), put(2,2), get(1)', expected: '-1', status: 'pending' },
    ],
    usedCount: 7, avgTime: '15m 12s', passRate: '62%',
  },
  '3': {
    title: 'Merge K Sorted Lists', difficulty: 'HARD', type: 'CODING',
    tags: ['heap', 'linked-list'],
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: '' },
      { input: 'lists = []', output: '[]', explanation: '' },
    ],
    constraints: ['k == lists.length', '0 ≤ k ≤ 10⁴', '0 ≤ lists[i].length ≤ 500', '-10⁴ ≤ lists[i][j] ≤ 10⁴'],
    starterCode: `import heapq\n\ndef mergeKLists(lists):\n    # Write your solution here\n    pass`,
    testCases: [
      { input: '[[1,4,5],[1,3,4],[2,6]]', expected: '[1,1,2,3,4,4,5,6]', status: 'pass' },
      { input: '[]', expected: '[]', status: 'pass' },
      { input: '[[]]', expected: '[]', status: 'pass' },
    ],
    usedCount: 3, avgTime: '22m 05s', passRate: '41%',
  },
};

function getQuestion(id: string) {
  if (QUESTIONS_DATA[id]) return QUESTIONS_DATA[id];
  return {
    title: `Question #${id}`, difficulty: 'MEDIUM', type: 'CODING',
    tags: ['algorithms'],
    description: 'Solve this problem using an efficient algorithm.\n\nAnalyse the constraints and choose the best approach.',
    examples: [{ input: 'Example input', output: 'Example output', explanation: 'Step-by-step walkthrough.' }],
    constraints: ['1 ≤ n ≤ 10⁵', 'Standard constraints apply'],
    starterCode: `def solve(input):\n    # Write your solution here\n    pass`,
    testCases: [
      { input: 'sample input', expected: 'expected output', status: 'pending' },
    ],
    usedCount: 0, avgTime: '—', passRate: '—',
  };
}

/* ────────────────────────────────────────────────────────── */

function renderDesc(text: string) {
  return text.split('\n').map((line, i) => (
    <p key={i} className="text-sm text-dash-text dark:text-editor-text leading-relaxed mb-2 last:mb-0">
      {line.split(/(`[^`]+`)/).map((part, j) =>
        part.startsWith('`') && part.endsWith('`')
          ? <code key={j} className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-mono">{part.slice(1, -1)}</code>
          : part.split(/(\*\*[^*]+\*\*)/).map((p2, k) =>
              p2.startsWith('**') && p2.endsWith('**')
                ? <strong key={k} className="font-bold text-dash-text dark:text-editor-text">{p2.slice(2, -2)}</strong>
                : <span key={k}>{p2}</span>
            )
      )}
    </p>
  ));
}

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const q = getQuestion(params.id);
  const [showCode, setShowCode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'testcases'>('description');

  const handleCopy = () => {
    navigator.clipboard.writeText(q.starterCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back + Actions */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6">
        <Link href="/questions" className="flex items-center gap-2 text-sm text-dash-muted dark:text-editor-comment hover:text-dash-text dark:hover:text-editor-text transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Questions
        </Link>
        <div className="flex items-center gap-2">
          <button className="btn-secondary btn-sm gap-1.5">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button className="btn-sm px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className={cn('badge text-xs', getDifficultyColor(q.difficulty))}>{q.difficulty}</span>
          <span className="text-xs text-dash-muted dark:text-editor-comment uppercase font-semibold tracking-wider">
            {q.type.replace('_', ' ')}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-dash-text dark:text-editor-text tracking-tight mb-3">{q.title}</h1>
        <div className="flex flex-wrap gap-2">
          {q.tags.map((tag: string) => (
            <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 text-xs font-medium">
              <Tag className="w-3 h-3" /> {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Users,        label: 'Used',      value: `${q.usedCount} times`, iconClass: 'text-indigo-500 dark:text-indigo-300', bgClass: 'bg-indigo-50 dark:bg-indigo-500/15' },
          { icon: Clock,        label: 'Avg. Time', value: q.avgTime,              iconClass: 'text-amber-500  dark:text-amber-300',  bgClass: 'bg-amber-50  dark:bg-amber-500/15'  },
          { icon: CheckCircle2, label: 'Pass Rate', value: q.passRate,             iconClass: 'text-emerald-500 dark:text-emerald-300',bgClass: 'bg-emerald-50 dark:bg-emerald-500/15'},
        ].map(s => (
          <div key={s.label} className="card p-4 flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', s.bgClass)}>
              <s.icon className={cn('w-5 h-5', s.iconClass)} />
            </div>
            <div>
              <p className="text-xs text-dash-muted dark:text-editor-comment font-medium">{s.label}</p>
              <p className="text-sm font-bold text-dash-text dark:text-editor-text">{s.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left: Description / Test Cases ── */}
        <motion.div className="lg:col-span-3 space-y-4"
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>

          {/* Tab bar */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-editor-surface rounded-xl">
            {(['description', 'testcases'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-all',
                  activeTab === tab
                    ? 'bg-white dark:bg-editor-bg text-dash-text dark:text-editor-text shadow-sm'
                    : 'text-dash-muted dark:text-editor-comment hover:text-dash-text dark:hover:text-editor-text'
                )}>
                {tab === 'description' ? 'Description' : `Test Cases (${q.testCases.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <div className="card p-6 space-y-6">
              {/* Description text */}
              <div>{renderDesc(q.description)}</div>

              {/* Examples */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-dash-text dark:text-editor-text uppercase tracking-wider">Examples</h3>
                {q.examples.map((ex: any, i: number) => (
                  <div key={i} className="rounded-xl bg-gray-50 dark:bg-editor-bg border border-dash-border dark:border-editor-border p-4">
                    <p className="text-xs font-bold text-dash-muted dark:text-editor-comment mb-2">Example {i + 1}</p>
                    <div className="space-y-1.5">
                      <p className="text-xs">
                        <span className="font-semibold text-dash-text dark:text-editor-text">Input: </span>
                        <code className="font-mono text-indigo-600 dark:text-indigo-300">{ex.input}</code>
                      </p>
                      <p className="text-xs">
                        <span className="font-semibold text-dash-text dark:text-editor-text">Output: </span>
                        <code className="font-mono text-emerald-600 dark:text-emerald-400">{ex.output}</code>
                      </p>
                      {ex.explanation && (
                        <p className="text-xs text-dash-muted dark:text-editor-comment">
                          <span className="font-semibold text-dash-text dark:text-editor-text">Explanation: </span>
                          {ex.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-xs font-bold text-dash-text dark:text-editor-text uppercase tracking-wider mb-2">Constraints</h3>
                <ul className="space-y-1.5">
                  {q.constraints.map((c: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-dash-muted dark:text-editor-comment">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 shrink-0" />
                      <code className="font-mono">{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="divide-y divide-dash-border dark:divide-editor-border">
                {q.testCases.map((tc: any, i: number) => (
                  <div key={i} className="p-4 hover:bg-gray-50/50 dark:hover:bg-editor-surface/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-dash-text dark:text-editor-text">Test Case {i + 1}</span>
                      <span className={cn('badge text-[10px]',
                        tc.status === 'pass'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-gray-100 dark:bg-editor-surface text-gray-500 dark:text-editor-comment'
                      )}>
                        {tc.status === 'pass' ? '✓ Passed' : '○ Pending'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 dark:bg-editor-bg border border-dash-border dark:border-editor-border p-2.5">
                        <p className="text-[10px] text-dash-muted dark:text-editor-comment font-semibold uppercase mb-1">Input</p>
                        <code className="text-xs font-mono text-dash-text dark:text-editor-text">{tc.input}</code>
                      </div>
                      <div className="rounded-lg bg-gray-50 dark:bg-editor-bg border border-dash-border dark:border-editor-border p-2.5">
                        <p className="text-[10px] text-dash-muted dark:text-editor-comment font-semibold uppercase mb-1">Expected</p>
                        <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{tc.expected}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Right: Starter Code ── */}
        <motion.div className="lg:col-span-2"
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="card overflow-hidden sticky top-8">
            <button onClick={() => setShowCode(!showCode)}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-dash-border dark:border-editor-border hover:bg-gray-50/50 dark:hover:bg-editor-surface/50 transition-colors">
              <span className="flex items-center gap-2 text-xs font-bold text-dash-text dark:text-editor-text uppercase tracking-wider">
                <Code2 className="w-4 h-4 text-brand-primary" />
                Starter Code
              </span>
              {showCode
                ? <ChevronUp className="w-4 h-4 text-dash-muted dark:text-editor-comment" />
                : <ChevronDown className="w-4 h-4 text-dash-muted dark:text-editor-comment" />}
            </button>

            {showCode && (
              <div className="relative">
                <button onClick={handleCopy} title="Copy code"
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 dark:bg-editor-surface border border-dash-border dark:border-editor-border text-dash-muted dark:text-editor-comment hover:text-dash-text dark:hover:text-editor-text transition-colors z-10">
                  {copied
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre className="p-5 text-xs font-mono leading-relaxed text-editor-text bg-editor-bg overflow-x-auto max-h-[420px]">
                  <code>{q.starterCode}</code>
                </pre>
              </div>
            )}

            <div className="p-4 border-t border-dash-border dark:border-editor-border space-y-2">
              <Link href={`/room/${params.id}?qid=${params.id}&name=Interviewer&role=interviewer`} className="btn-primary w-full py-2.5 text-sm">
                <Play className="w-4 h-4" /> Use in Interview
              </Link>
              <button className="btn-secondary w-full py-2.5 text-sm">
                <Edit2 className="w-4 h-4" /> Edit Question
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
