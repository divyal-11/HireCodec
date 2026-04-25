import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Piston API language mappings
const PISTON_LANGUAGES: Record<string, { language: string; version: string }> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { code, language, stdin } = body;

  if (!code || !language) {
    return NextResponse.json({ error: 'code and language are required' }, { status: 400 });
  }

  const normalizedLang = language.toLowerCase().trim();
  const pistonConfig = PISTON_LANGUAGES[normalizedLang];

  if (!pistonConfig) {
    return NextResponse.json({ error: `Language '${language}' not supported yet` }, { status: 400 });
  }

  const executionId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: pistonConfig.language,
        version: pistonConfig.version,
        files: [{ content: code }],
        stdin: stdin || '',
      }),
    });

    if (response.status === 429) {
      return NextResponse.json({
        executionId,
        status: 'SYSTEM_ERROR',
        stdout: null,
        stderr: 'Execution service is busy. Please wait a moment and try again.',
        exitCode: -1,
        timeMs: Date.now() - startTime,
      }, { status: 429 });
    }

    if (!response.ok) {
      return NextResponse.json({
        executionId,
        status: 'SYSTEM_ERROR',
        stdout: null,
        stderr: `Execution service error (${response.status}). Please try again.`,
        exitCode: -1,
        timeMs: Date.now() - startTime,
      }, { status: 500 });
    }

    const data = await response.json();
    
    // Piston returns run and compile phases
    const runResult = data.run || {};
    const compileResult = data.compile || {};

    const stdout = runResult.stdout || '';
    const stderr = runResult.stderr || compileResult.stderr || '';
    const exitCode = runResult.code ?? (compileResult.code || 0);

    let status = 'ACCEPTED';
    if (exitCode !== 0) status = 'RUNTIME_ERROR';
    if (compileResult.code && compileResult.code !== 0) status = 'COMPILATION_ERROR';
    if (runResult.signal === 'SIGKILL') status = 'TIME_LIMIT_EXCEEDED';

    return NextResponse.json({
      executionId,
      status,
      stdout: stdout.slice(0, 65536),
      stderr: stderr.slice(0, 4096),
      exitCode,
      timeMs: Date.now() - startTime,
      memoryKb: 0, // Piston doesn't easily expose memory in v2 response
    });
  } catch (error: any) {
    console.error('[Execute] Error:', error.message);
    return NextResponse.json({
      executionId,
      status: 'SYSTEM_ERROR',
      stdout: null,
      stderr: error.message || 'Execution engine failure',
      exitCode: -1,
      timeMs: Date.now() - startTime,
    }, { status: 500 });
  }
}
