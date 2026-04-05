'use client';

import ReactMarkdown from 'react-markdown';
import { Lightbulb, FileText, BookOpen } from 'lucide-react';
import { cn, getDifficultyColor } from '@/lib/utils';
import type { RoomQuestion } from '@hire-codec/shared';

interface QuestionPanelProps {
  question: RoomQuestion | null;
  role: string;
}

export function QuestionPanel({ question, role }: QuestionPanelProps) {
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-editor-surface border-r border-editor-border p-6 text-center">
        <BookOpen className="w-12 h-12 text-editor-comment mb-4 opacity-40" />
        <p className="text-editor-comment text-sm">
          No question assigned yet.
        </p>
        {role === 'interviewer' && (
          <p className="text-editor-comment text-xs mt-2 opacity-60">
            Select a question from the toolbar to begin.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-editor-surface border-r border-editor-border">
      {/* Question Header */}
      <div className="px-4 py-3 border-b border-editor-border bg-editor-bg">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-brand-primary" />
          <h2 className="text-sm font-semibold text-editor-text truncate">
            {question.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'badge text-[10px] font-bold uppercase tracking-wider',
              getDifficultyColor(question.difficulty)
            )}
          >
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Question Body */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-lg font-bold text-editor-text mb-3">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-semibold text-editor-text mb-2 mt-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold text-editor-text mb-1.5 mt-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-sm text-editor-text/80 mb-3 leading-relaxed">{children}</p>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="px-1.5 py-0.5 rounded bg-editor-bg text-brand-accent text-xs font-mono">
                    {children}
                  </code>
                ) : (
                  <code
                    className="block bg-editor-bg rounded-lg p-3 text-xs font-mono text-editor-text overflow-x-auto"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-editor-bg rounded-lg p-3 overflow-x-auto mb-3 border border-editor-border">
                  {children}
                </pre>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-editor-text">{children}</strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 mb-3 text-sm text-editor-text/80">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 mb-3 text-sm text-editor-text/80">
                  {children}
                </ol>
              ),
            }}
          >
            {question.description}
          </ReactMarkdown>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-editor-border bg-editor-bg">
        <button className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-editor-comment hover:text-brand-accent transition-colors">
          <Lightbulb className="w-3.5 h-3.5" />
          Hint
        </button>
        <button className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-editor-comment hover:text-brand-primary transition-colors">
          <FileText className="w-3.5 h-3.5" />
          Notes
        </button>
      </div>
    </div>
  );
}
