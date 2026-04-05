'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import {
  Play,
  Send,
  RotateCcw,
  Loader2,
  Settings,
  Maximize2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Language } from '@hire-codec/shared';
import '@/styles/editor.css';

interface CodePanelProps {
  roomId: string;
  token: string;
  user: { id: string; name: string; role: string };
  language: Language;
  theme: string;
  fontSize: number;
  isReadOnly: boolean;
  onRun: (code: string) => void;
  onSubmit: (code: string) => void;
  executing: boolean;
}

export function CodePanel({
  roomId,
  token,
  user,
  language,
  theme,
  fontSize,
  isReadOnly,
  onRun,
  onSubmit,
  executing,
}: CodePanelProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEditorMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Register custom theme
      monaco.editor.defineTheme('codeinterview-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: 'FF7B72', fontStyle: 'bold' },
          { token: 'string', foreground: 'A5D6FF' },
          { token: 'comment', foreground: '8B949E', fontStyle: 'italic' },
          { token: 'function', foreground: 'D2A8FF' },
          { token: 'number', foreground: '79C0FF' },
          { token: 'type', foreground: 'FFA657' },
          { token: 'variable', foreground: 'FFA657' },
        ],
        colors: {
          'editor.background': '#0D1117',
          'editor.foreground': '#C9D1D9',
          'editor.lineHighlightBackground': '#161B22',
          'editorCursor.foreground': '#58A6FF',
          'editor.selectionBackground': '#264F78',
          'editorLineNumber.foreground': '#30363D',
          'editorLineNumber.activeForeground': '#8B949E',
          'editor.inactiveSelectionBackground': '#264F7850',
          'editorBracketMatch.background': '#30363D',
          'editorBracketMatch.border': '#58A6FF',
        },
      });

      monaco.editor.setTheme('codeinterview-dark');

      // Keyboard shortcuts
      editor.addAction({
        id: 'run-code',
        label: 'Run Code',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
        run: () => {
          const value = editor.getValue();
          onRun(value);
        },
      });

      editor.addAction({
        id: 'submit-code',
        label: 'Submit Code',
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
        ],
        run: () => {
          const value = editor.getValue();
          onSubmit(value);
        },
      });

      editor.focus();
    },
    [onRun, onSubmit]
  );

  const handleRun = () => {
    const value = editorRef.current?.getValue() || code;
    onRun(value);
  };

  const handleSubmit = () => {
    const value = editorRef.current?.getValue() || code;
    onSubmit(value);
  };

  const handleReset = () => {
    if (editorRef.current) {
      editorRef.current.setValue('');
    }
    setCode('');
  };

  const getMonacoLanguage = (lang: Language) => {
    const map: Record<Language, string> = {
      python: 'python',
      javascript: 'javascript',
      java: 'java',
      cpp: 'cpp',
      go: 'go',
      rust: 'rust',
    };
    return map[lang] || 'plaintext';
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-editor-bg",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      {/* Editor Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-editor-surface border-b border-editor-border">
        <button
          onClick={handleRun}
          disabled={executing}
          className={cn(
            "btn-sm flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            "bg-brand-success/10 text-brand-success hover:bg-brand-success/20 border border-brand-success/30",
            executing && "opacity-50 cursor-not-allowed"
          )}
        >
          {executing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          Run
          <span className="text-[10px] opacity-60 ml-1">⌘↵</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={executing}
          className={cn(
            "btn-sm flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 border border-brand-primary/30",
            executing && "opacity-50 cursor-not-allowed"
          )}
        >
          <Send className="w-3.5 h-3.5" />
          Submit
          <span className="text-[10px] opacity-60 ml-1">⌘⇧↵</span>
        </button>

        <div className="flex-1" />

        <button
          onClick={handleReset}
          className="btn-ghost p-1.5 rounded-md text-editor-comment hover:text-editor-text"
          title="Reset code"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="btn-ghost p-1.5 rounded-md text-editor-comment hover:text-editor-text"
          title="Toggle fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          theme="codeinterview-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorMount}
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono', monospace",
            fontLigatures: true,
            minimap: { enabled: true, maxColumn: 80 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'gutter',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 12, bottom: 12 },
            readOnly: isReadOnly,
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
          }}
        />
      </div>
    </div>
  );
}
