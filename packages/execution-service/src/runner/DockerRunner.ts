import Dockerode from 'dockerode';
import type { Language, RunConfig } from '@hire-codec/shared';

let docker: Dockerode;
try {
  docker = new Dockerode({
    socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
  });
} catch {
  console.warn('[DockerRunner] Docker not available — using mock execution');
}

export interface ExecutionResult {
  status: string;
  exitCode?: number;
  stdout: string;
  stderr: string;
  timeMs: number;
  memoryKb: number;
}

const IMAGES: Record<Language, string> = {
  python: 'codeinterview/sandbox-python:3.12',
  javascript: 'codeinterview/sandbox-node:20',
  java: 'codeinterview/sandbox-java:21',
  cpp: 'codeinterview/sandbox-gcc:13',
  go: 'codeinterview/sandbox-go:1.22',
  rust: 'codeinterview/sandbox-rust:1.77',
};

export class DockerRunner {
  async run(config: RunConfig): Promise<ExecutionResult> {
    if (!docker) {
      return this.mockRun(config);
    }

    const startTime = Date.now();
    let timedOut = false;

    try {
      const container = await docker.createContainer({
        Image: IMAGES[config.language],
        Cmd: this.buildCommand(config),
        HostConfig: {
          Memory: config.memoryLimitMb * 1024 * 1024,
          MemorySwap: config.memoryLimitMb * 1024 * 1024,
          CpuQuota: Number(process.env.EXECUTION_CPU_QUOTA) || 50000,
          CpuPeriod: 100000,
          PidsLimit: 64,
          NetworkMode: 'none',
          ReadonlyRootfs: true,
          CapDrop: ['ALL'],
        },
        Env: [
          `CODE=${Buffer.from(config.code).toString('base64')}`,
          `STDIN=${config.stdin || ''}`,
          `TIME_LIMIT=${Math.floor(config.timeLimitMs / 1000)}`,
        ],
        AttachStdout: true,
        AttachStderr: true,
      });

      await container.start();

      // Timeout watchdog
      const timeout = setTimeout(async () => {
        timedOut = true;
        await container.kill().catch(() => {});
      }, config.timeLimitMs + 2000);

      const { stdout, stderr } = await this.collectStreams(container);
      const exitData = await container.wait();
      clearTimeout(timeout);

      const timeMs = Date.now() - startTime;
      await container.remove({ force: true });

      if (timedOut) {
        return { status: 'TIME_LIMIT_EXCEEDED', timeMs, stdout: '', stderr: 'Time limit exceeded', memoryKb: 0 };
      }

      return {
        status: exitData.StatusCode === 0 ? 'OK' : 'RUNTIME_ERROR',
        exitCode: exitData.StatusCode,
        stdout: stdout.slice(0, 65536),
        stderr: stderr.slice(0, 4096),
        timeMs,
        memoryKb: 0,
      };
    } catch (error) {
      return {
        status: 'SYSTEM_ERROR',
        stdout: '',
        stderr: (error as Error).message,
        timeMs: Date.now() - startTime,
        memoryKb: 0,
      };
    }
  }

  private buildCommand(config: RunConfig): string[] {
    switch (config.language) {
      case 'python':
        return ['sh', '-c', 'echo "$CODE" | base64 -d > /tmp/sol.py && echo "$STDIN" | timeout $TIME_LIMIT python /tmp/sol.py'];
      case 'javascript':
        return ['sh', '-c', 'echo "$CODE" | base64 -d > /tmp/sol.js && echo "$STDIN" | timeout $TIME_LIMIT node /tmp/sol.js'];
      case 'java':
        return ['sh', '-c', 'echo "$CODE" | base64 -d > /tmp/Solution.java && javac /tmp/Solution.java && echo "$STDIN" | timeout $TIME_LIMIT java -cp /tmp Solution'];
      case 'cpp':
        return ['sh', '-c', 'echo "$CODE" | base64 -d > /tmp/sol.cpp && g++ -O2 -o /tmp/sol /tmp/sol.cpp && echo "$STDIN" | timeout $TIME_LIMIT /tmp/sol'];
      case 'go':
        return ['sh', '-c', 'echo "$CODE" | base64 -d > /tmp/sol.go && echo "$STDIN" | timeout $TIME_LIMIT go run /tmp/sol.go'];
      case 'rust':
        return ['sh', '-c', 'echo "$CODE" | base64 -d > /tmp/sol.rs && rustc -o /tmp/sol /tmp/sol.rs && echo "$STDIN" | timeout $TIME_LIMIT /tmp/sol'];
      default:
        return ['echo', 'Unsupported language'];
    }
  }

  private async collectStreams(container: any): Promise<{ stdout: string; stderr: string }> {
    const stream = await container.logs({ stdout: true, stderr: true, follow: true });
    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      stream.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      stream.on('end', () => resolve({ stdout, stderr }));
      stream.on('error', () => resolve({ stdout, stderr }));

      setTimeout(() => resolve({ stdout, stderr }), 15000);
    });
  }

  // Fallback when Docker isn't available
  private async mockRun(config: RunConfig): Promise<ExecutionResult> {
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
    return {
      status: 'OK',
      exitCode: 0,
      stdout: `[Mock] Executed ${config.language} code (${config.code.length} chars)`,
      stderr: '',
      timeMs: Math.floor(Math.random() * 100 + 20),
      memoryKb: Math.floor(Math.random() * 8192 + 4096),
    };
  }
}
