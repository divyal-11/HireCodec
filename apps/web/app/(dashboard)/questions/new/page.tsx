'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Code2, Eye, EyeOff, Save } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NewQuestionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'MEDIUM',
    type: 'CODING',
    tags: '',
    timeLimitMs: 5000,
    memoryLimitMb: 256,
  });
  const [testCases, setTestCases] = useState([
    { input: '', expectedOutput: '', isHidden: false, explanation: '' },
  ]);
  const [loading, setLoading] = useState(false);

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false, explanation: '' }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/questions');
    }, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/questions" className="flex items-center gap-1.5 text-sm text-dash-muted hover:text-dash-text mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Questions
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-dash-text mb-8">Create Question</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-dash-text">Question Details</h2>
            
            <div>
              <label className="text-xs font-medium text-dash-muted mb-1.5 block">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Two Sum" className="input" required />
            </div>

            <div>
              <label className="text-xs font-medium text-dash-muted mb-1.5 block">Description (Markdown)</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="## Problem Statement\n\nDescribe the problem..." className="input min-h-[200px] font-mono text-xs" required />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1.5 block">Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="input">
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1.5 block">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
                  <option value="CODING">Coding</option>
                  <option value="SYSTEM_DESIGN">System Design</option>
                  <option value="SQL">SQL</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1.5 block">Time Limit (ms)</label>
                <input type="number" value={form.timeLimitMs} onChange={(e) => setForm({ ...form, timeLimitMs: Number(e.target.value) })} className="input" />
              </div>
              <div>
                <label className="text-xs font-medium text-dash-muted mb-1.5 block">Memory (MB)</label>
                <input type="number" value={form.memoryLimitMb} onChange={(e) => setForm({ ...form, memoryLimitMb: Number(e.target.value) })} className="input" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-dash-muted mb-1.5 block">Tags (comma-separated)</label>
              <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="arrays, hash-map, dynamic-programming" className="input" />
            </div>
          </div>

          {/* Test Cases */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-dash-text">Test Cases</h2>
              <button type="button" onClick={addTestCase} className="btn-ghost btn-sm text-brand-primary">
                <Plus className="w-3.5 h-3.5" /> Add Test Case
              </button>
            </div>

            <div className="space-y-4">
              {testCases.map((tc, i) => (
                <div key={i} className="p-4 rounded-lg bg-gray-50 border border-dash-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-dash-text">Test Case {i + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...testCases];
                          updated[i].isHidden = !updated[i].isHidden;
                          setTestCases(updated);
                        }}
                        className={cn("btn-ghost p-1 rounded text-xs", tc.isHidden ? "text-brand-warning" : "text-dash-muted")}
                        title={tc.isHidden ? 'Hidden from candidate' : 'Visible to candidate'}
                      >
                        {tc.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      {testCases.length > 1 && (
                        <button type="button" onClick={() => removeTestCase(i)} className="btn-ghost p-1 rounded text-brand-danger">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-dash-muted block mb-1">Input</label>
                      <textarea
                        value={tc.input}
                        onChange={(e) => {
                          const updated = [...testCases];
                          updated[i].input = e.target.value;
                          setTestCases(updated);
                        }}
                        className="input font-mono text-xs min-h-[60px]"
                        placeholder="[2,7,11,15]\n9"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-dash-muted block mb-1">Expected Output</label>
                      <textarea
                        value={tc.expectedOutput}
                        onChange={(e) => {
                          const updated = [...testCases];
                          updated[i].expectedOutput = e.target.value;
                          setTestCases(updated);
                        }}
                        className="input font-mono text-xs min-h-[60px]"
                        placeholder="[0,1]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link href="/questions" className="btn-secondary btn-md">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary btn-md">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" />Save Question</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
