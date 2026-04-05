'use client';

import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Terminal,
  MemoryStick,
} from 'lucide-react';
import { cn, getStatusColor } from '@/lib/utils';
import type { ExecutionResult } from '@hire-codec/shared';

interface TestResultsProps {
  result: ExecutionResult | null;
  error: string | null;
  executing: boolean;
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'ACCEPTED':
      return <CheckCircle2 className="w-4 h-4 text-brand-success" />;
    case 'WRONG_ANSWER':
      return <XCircle className="w-4 h-4 text-brand-danger" />;
    case 'TIME_LIMIT_EXCEEDED':
      return <Clock className="w-4 h-4 text-brand-warning" />;
    case 'RUNTIME_ERROR':
    case 'COMPILATION_ERROR':
      return <AlertTriangle className="w-4 h-4 text-brand-danger" />;
    default:
      return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
  }
}

function statusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}

export function TestResults({ result, error, executing }: TestResultsProps) {
  return (
    <div className="flex flex-col h-full bg-editor-bg border-t border-editor-border">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-editor-surface border-b border-editor-border">
        <Terminal className="w-4 h-4 text-editor-comment" />
        <span className="text-xs font-medium text-editor-text">Output</span>

        {result && (
          <div className="flex items-center gap-3 ml-auto text-[10px] text-editor-comment">
            {result.timeMs !== undefined && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {result.timeMs}ms
              </span>
            )}
            {result.memoryKb !== undefined && (
              <span className="flex items-center gap-1">
                <MemoryStick className="w-3 h-3" />
                {(result.memoryKb / 1024).toFixed(1)}MB
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Loading state */}
        {executing && (
          <div className="flex items-center gap-3 text-editor-comment">
            <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
            <span className="text-sm">Running code...</span>
          </div>
        )}

        {/* Error state */}
        {error && !executing && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-brand-danger" />
              <span className="text-sm font-medium text-brand-danger">Error</span>
            </div>
            <pre className="text-xs font-mono text-red-300 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {/* Empty state */}
        {!result && !error && !executing && (
          <div className="flex flex-col items-center justify-center h-full text-editor-comment opacity-40">
            <Terminal className="w-8 h-8 mb-2" />
            <p className="text-xs">Run your code to see output here</p>
            <p className="text-[10px] mt-1">⌘+Enter to run • ⌘+Shift+Enter to submit</p>
          </div>
        )}

        {/* Result */}
        {result && !executing && (
          <div className="space-y-4">
            {/* Overall status */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg",
              result.status === 'ACCEPTED'
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : "bg-red-500/10 border border-red-500/20"
            )}>
              <StatusIcon status={result.status} />
              <span className={cn("text-sm font-semibold", getStatusColor(result.status))}>
                {statusLabel(result.status)}
              </span>
            </div>

            {/* Stdout */}
            {result.stdout && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-editor-comment mb-1.5 font-medium">
                  Standard Output
                </div>
                <pre className="bg-editor-surface rounded-lg p-3 text-xs font-mono text-editor-text border border-editor-border whitespace-pre-wrap">
                  {result.stdout}
                </pre>
              </div>
            )}

            {/* Stderr */}
            {result.stderr && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-red-400 mb-1.5 font-medium">
                  Standard Error
                </div>
                <pre className="bg-red-500/5 rounded-lg p-3 text-xs font-mono text-red-300 border border-red-500/20 whitespace-pre-wrap">
                  {result.stderr}
                </pre>
              </div>
            )}

            {/* Test case results */}
            {result.testResults && result.testResults.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-editor-comment mb-2 font-medium">
                  Test Cases ({result.testResults.filter((t) => t.status === 'ACCEPTED').length}/
                  {result.testResults.length} passed)
                </div>
                <div className="space-y-1.5">
                  {result.testResults.map((test, i) => (
                    <div
                      key={test.testCaseId || i}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors",
                        test.status === 'ACCEPTED'
                          ? "bg-emerald-500/5 border border-emerald-500/10"
                          : "bg-red-500/5 border border-red-500/10"
                      )}
                    >
                      <StatusIcon status={test.status} />
                      <span className="font-medium text-editor-text">Test {i + 1}</span>
                      <span className={cn("ml-1", getStatusColor(test.status))}>
                        {statusLabel(test.status)}
                      </span>
                      {test.timeMs !== undefined && (
                        <span className="ml-auto text-editor-comment">{test.timeMs}ms</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
