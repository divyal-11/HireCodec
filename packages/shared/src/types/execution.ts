export interface RunConfig {
  code: string;
  language: Language;
  stdin?: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  questionId?: string;
  roomId?: string;
}

export type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'go' | 'rust';

export type ExecutionStatusType =
  | 'PENDING'
  | 'RUNNING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILATION_ERROR'
  | 'SYSTEM_ERROR';

export interface ExecutionResult {
  executionId: string;
  status: ExecutionStatusType;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  exitCode?: number;
  timeMs?: number;
  memoryKb?: number;
  testResults?: TestResult[];
}

export interface TestResult {
  testCaseId: string;
  status: ExecutionStatusType;
  actualOutput?: string;
  expectedOutput?: string;
  timeMs?: number;
  memoryKb?: number;
}

export interface SubmitCodeDto {
  code: string;
  language: Language;
  roomId: string;
  stdin?: string;
  questionId?: string;
}
