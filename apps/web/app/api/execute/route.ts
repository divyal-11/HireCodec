import { NextRequest, NextResponse } from 'next/server';

// POST /api/execute — Run code (no test cases)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, language, roomId, stdin, questionId } = body;

  if (!code || !language) {
    return NextResponse.json(
      { error: 'Code and language are required' },
      { status: 400 }
    );
  }

  // In production, this would:
  // 1. Enqueue to Bull queue
  // 2. DockerRunner pulls pre-warmed container
  // 3. Injects code, runs with limits
  // 4. Returns result
  
  // Mock execution for development
  const executionId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    const timeMs = Date.now() - startTime;

    // Mock successful execution
    const result = {
      executionId,
      status: 'ACCEPTED',
      stdout: simulateOutput(code, language),
      stderr: null,
      compileOutput: null,
      exitCode: 0,
      timeMs,
      memoryKb: Math.floor(Math.random() * 16384 + 4096),
      testResults: questionId ? generateMockTestResults() : undefined,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      executionId,
      status: 'RUNTIME_ERROR',
      stdout: null,
      stderr: 'Error executing code',
      exitCode: 1,
      timeMs: Date.now() - startTime,
      memoryKb: 0,
    });
  }
}

function simulateOutput(code: string, language: string): string {
  // Simple simulation: look for print/console.log statements
  const printMatches = code.match(/(?:print|console\.log|System\.out\.println|fmt\.Println|println!)\s*\((.+?)\)/g);
  if (printMatches) {
    return printMatches
      .map((m) => {
        const content = m.match(/\((.+?)\)/)?.[1] || '';
        return content.replace(/['"]/g, '');
      })
      .join('\n');
  }
  return 'Program executed successfully (no output)';
}

function generateMockTestResults() {
  const statuses = ['ACCEPTED', 'ACCEPTED', 'ACCEPTED', 'WRONG_ANSWER', 'ACCEPTED'];
  return statuses.map((status, i) => ({
    testCaseId: crypto.randomUUID(),
    status,
    actualOutput: status === 'ACCEPTED' ? '[0,1]' : '[1,0]',
    expectedOutput: '[0,1]',
    timeMs: Math.floor(Math.random() * 50 + 5),
    memoryKb: Math.floor(Math.random() * 4096 + 2048),
  }));
}
