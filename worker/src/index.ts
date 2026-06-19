import { Worker } from 'bullmq';
import { connection } from './config/redis';
import { executeCode } from './execution/executor';
import { Logger } from './config/logger';

const logger = new Logger('Worker');

async function startWorker() {
  try {
    logger.info('Starting code execution worker...');

    const codeExecutionWorker = new Worker(
      'code-execution',
      async (job) => {
        logger.info(`Processing job ${job.id}: executing code for submission`);

        try {
          const result = await executeCode(job.data);
          logger.info(`Job ${job.id} completed successfully`);
          return result;
        } catch (error) {
          logger.error(`Job ${job.id} failed: ${error}`);
          throw error;
        }
      },
      {
        connection,
        concurrency: 5,
        maxStalledCount: 3
      }
    );

    // Event handlers
    codeExecutionWorker.on('completed', (job) => {
      logger.info(`Job ${job.id} completed`);
    });

    codeExecutionWorker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} failed: ${err.message}`);
    });

    codeExecutionWorker.on('error', (err) => {
      logger.error(`Worker error: ${err.message}`);
    });

    logger.info('✓ Code execution worker started successfully');
  } catch (error) {
    logger.error(`Failed to start worker: ${error}`);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.warn('SIGTERM received, shutting down...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.warn('SIGINT received, shutting down...');
  process.exit(0);
});

startWorker().catch((error) => {
  logger.error(`Startup error: ${error}`);
  process.exit(1);
});
