'use client';

import { useEffect, useRef } from 'react';
import { cn, getDifficultyColor } from '@/lib/utils';
import type { editor } from 'monaco-editor';

interface CursorInfo {
  clientId: number;
  name: string;
  color: string;
  lineNumber: number;
  column: number;
}

interface ParticipantCursorsProps {
  cursors: CursorInfo[];
  editorInstance: editor.IStandaloneCodeEditor | null;
}

export function ParticipantCursors({ cursors, editorInstance }: ParticipantCursorsProps) {
  const decorationsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!editorInstance) return;

    const newDecorations = cursors.map((cursor) => ({
      range: {
        startLineNumber: cursor.lineNumber,
        startColumn: cursor.column,
        endLineNumber: cursor.lineNumber,
        endColumn: cursor.column + 1,
      },
      options: {
        className: 'remote-cursor-decoration',
        afterContentClassName: `remote-cursor-label-${cursor.clientId}`,
        stickiness: 1,
        hoverMessage: { value: cursor.name },
      },
    }));

    decorationsRef.current = editorInstance.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [cursors, editorInstance]);

  // Render cursor labels as overlay
  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {cursors.map((cursor) => (
        <div
          key={cursor.clientId}
          className="absolute pointer-events-none transition-all duration-100"
          style={{
            // Position calculated from editor layout — approximate
            left: `${cursor.column * 8}px`,
            top: `${(cursor.lineNumber - 1) * 20}px`,
          }}
        >
          <div
            className="remote-cursor"
            style={{ backgroundColor: cursor.color, height: '20px' }}
          />
          <div
            className="remote-cursor-label"
            style={{ backgroundColor: cursor.color, color: 'white' }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </div>
  );
}
