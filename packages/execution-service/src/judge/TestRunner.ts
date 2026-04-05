import { DockerRunner, type ExecutionResult } from '../runner/DockerRunner';
import { Comparator } from './Comparator';
import type { Language } from '@hire-codec/shared';

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface TestCaseResult {
  testCaseId: string;
  status: string;
  actualOutput: string;
  expectedOutput: string;
  timeMs: number;
  memoryKb: number;
}

export class TestRunner {
  constructor(private dockerRunner: DockerRunner) {}

  async runTestCases(
    questionId: string,
    code: string,
    language: Language
  ): Promise<TestCaseResult[]> {
    // In production: fetch test cases from database
    const testCases = await this.getTestCases(questionId);
    const results: TestCaseResult[] = [];

    for (const tc of testCases) {
      const execResult = await this.dockerRunner.run({
        code,
        language,
        stdin: tc.input,
        timeLimitMs: 5000,
        memoryLimitMb: 256,
      });

      const actualOutput = execResult.stdout.trim();
      const status = Comparator.compare(actualOutput, tc.expectedOutput.trim())
        ? 'ACCEPTED'
        : execResult.status === 'OK'
        ? 'WRONG_ANSWER'
        : execResult.status;

      results.push({
        testCaseId: tc.id,
        status,
        actualOutput,
        expectedOutput: tc.expectedOutput,
        timeMs: execResult.timeMs,
        memoryKb: execResult.memoryKb,
      });
    }

    return results;
  }

  private async getTestCases(questionId: string): Promise<TestCase[]> {
    // Mock test cases for development
    return [
      { id: '1', input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
      { id: '2', input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
      { id: '3', input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true },
    ];
  }
}
