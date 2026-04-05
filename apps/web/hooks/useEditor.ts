'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@hire-codec/shared';
import type { Language } from '@hire-codec/shared';

interface UseEditorReturn {
  language: Language;
  setLanguage: (lang: Language) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  theme: 'codeinterview-dark' | 'vs-dark' | 'light';
  setTheme: (theme: 'codeinterview-dark' | 'vs-dark' | 'light') => void;
  code: string;
  setCode: (code: string) => void;
  isReadOnly: boolean;
}

interface UseEditorOptions {
  roomId: string;
  initialLanguage?: Language;
  role?: string;
}

export function useEditor({
  roomId,
  initialLanguage = DEFAULT_LANGUAGE,
  role = 'candidate',
}: UseEditorOptions): UseEditorReturn {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'codeinterview-dark' | 'vs-dark' | 'light'>('codeinterview-dark');
  const [code, setCode] = useState('');
  const socketRef = useRef(getSocket());

  useEffect(() => {
    const socket = socketRef.current;

    socket.on('code:language_changed', ({ language: newLang, starterCode }: any) => {
      setLanguageState(newLang);
      if (starterCode) {
        setCode(starterCode);
      }
    });

    return () => {
      socket.off('code:language_changed');
    };
  }, []);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);
      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.id === lang);
      socketRef.current.emit('code:language_change', {
        roomId,
        language: lang,
        starterCode: langConfig?.defaultCode,
      });
    },
    [roomId]
  );

  return {
    language,
    setLanguage,
    fontSize,
    setFontSize,
    theme,
    setTheme,
    code,
    setCode,
    isReadOnly: role === 'observer',
  };
}
