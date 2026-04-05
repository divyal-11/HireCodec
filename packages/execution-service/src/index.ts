import { DockerRunner } from './runner/DockerRunner';
import { ContainerPool } from './runner/ContainerPool';
import { TestRunner } from './judge/TestRunner';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Docker runner
const dockerRunner = new DockerRunner();
const containerPool = new ContainerPool();
const testRunner = new TestRunner(dockerRunner);

async function start() {
  // Initialize container pool (gracefully handles Docker being unavailable)
  try {
    await containerPool.initialize();
    console.log('Container pool initialized');
  } catch {
    console.log('Docker not available — running in mock mode');
  }

  // Only start BullMQ worker if Redis is available
  try {
    const { Worker, Queue } = await import('bullmq');

    const executionQueue = new Queue('execution', {
      connection: { url: REDIS_URL },
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 2,
        backoff: { type: 'exponential', delay: 1000 },
      },
    });

    const worker = new Worker(
      'execution',
      async (job) => {
        const config = job.data;
        console.log(
          `[Execution] Processing job ${job.id}: ${config.language} (${config.code.length} chars)`
        );

        try {
          const result = await dockerRunner.run(config);

          if (config.questionId) {
            const testResults = await testRunner.runTestCases(
              config.questionId,
              config.code,
              config.language
            );
            return { ...result, testResults };
          }

          return result;
        } catch (error) {
          console.error(`[Execution] Job ${job.id} failed:`, error);
          throw error;
        }
      },
      {
        connection: { url: REDIS_URL },
        concurrency: 5,
        limiter: { max: 10, duration: 60_000 },
      }
    );

    worker.on('completed', (job) => {
      console.log(`[Execution] Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[Execution] Job ${job?.id} failed:`, err.message);
    });

    console.log('🐳 Execution service started');
    console.log(`   Queue: execution`);
    console.log(`   Redis: ${REDIS_URL}`);
    console.log(`   Concurrency: 5`);
  } catch (err) {
    console.warn('⚠️  Redis not available — execution service running in standalone mode');
    console.warn('   Install and start Redis, or run via Docker Compose for full functionality');
    console.log('🐳 Execution service started (standalone mode — no queue)');
  }
}

start();
