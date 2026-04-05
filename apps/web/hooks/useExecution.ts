'use client';

import { useState, useCallback } from 'react';
import type { ExecutionResult, Language } from '@hire-codec/shared';

interface UseExecutionReturn {
  executing: boolean;
  result: ExecutionResult | null;
  error: string | null;
  runCode: (code: string, language: Language, stdin?: string) => Promise<void>;
  submitCode: (code: string, language: Language, questionId: string) => Promise<void>;
  clearResult: () => void;
}

export function useExecution(roomId: string): UseExecutionReturn {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCode = useCallback(
    async (code: string, language: Language, stdin?: string) => {
      setExecuting(true);
      setError(null);
      setResult(null);

      try {
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, roomId, stdin }),
        });

        if (!response.ok) {
          throw new Error(`Execution failed: ${response.statusText}`);
        }

        const data: ExecutionResult = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Execution failed');
      } finally {
        setExecuting(false);
      }
    },
    [roomId]
  );

  const submitCode = useCallback(
    async (code: string, language: Language, questionId: string) => {
      setExecuting(true);
      setError(null);
      setResult(null);

      try {
        const response = await fetch('/api/execute/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, roomId, questionId }),
        });

        if (!response.ok) {
          throw new Error(`Submission failed: ${response.statusText}`);
        }

        const data: ExecutionResult = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Submission failed');
      } finally {
        setExecuting(false);
      }
    },
    [roomId]
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { executing, result, error, runCode, submitCode, clearResult };
}
