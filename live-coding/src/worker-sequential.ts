import { Worker, Job } from "bullmq";
import chalk from "chalk";
import { redisConfig, QUEUE_NAME } from "./config/redis";
import { MessageData, ProcessingResult } from "./config/types";

class SequentialWorker {
  private worker: Worker;
  private workerId: string;
  private processedMessages: ProcessingResult[] = [];

  constructor() {
    this.workerId = `sequential-worker-${process.pid}`;

    this.worker = new Worker(QUEUE_NAME, this.processMessage.bind(this), {
      connection: redisConfig,
      concurrency: 1, // KEY: This ensures sequential processing
    });

    this.setupEventListeners();
  }

  private async processMessage(
    job: Job<MessageData>
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    const { id, message, processingTime } = job.data;

    console.log(
      chalk.cyan(`🔄 [${this.workerId}] Started processing: ${message}`)
    );

    // Simulate work
    await this.sleep(processingTime);

    const endTime = Date.now();
    const result: ProcessingResult = {
      messageId: id,
      workerId: this.workerId,
      startTime,
      endTime,
      processingDuration: endTime - startTime,
    };

    this.processedMessages.push(result);

    console.log(
      chalk.green(
        `✅ [${this.workerId}] Completed: ${message} ` +
          `(took ${result.processingDuration}ms)`
      )
    );

    return result;
  }

  private setupEventListeners(): void {
    this.worker.on("completed", (job) => {
      console.log(chalk.blue(`📋 Job ${job.id} completed by ${this.workerId}`));
    });

    this.worker.on("failed", (job, err) => {
      console.log(chalk.red(`❌ Job ${job?.id} failed:`, err.message));
    });

    this.worker.on("error", (err) => {
      console.log(chalk.red(`💥 Worker error:`, err));
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log(chalk.yellow("\n🛑 Shutting down sequential worker..."));
      await this.printSummary();
      await this.worker.close();
      process.exit(0);
    });
  }

  private async printSummary(): Promise<void> {
    console.log(chalk.yellow("\n📊 Sequential Processing Summary:"));
    console.log(chalk.white(`Worker ID: ${this.workerId}`));
    console.log(
      chalk.white(`Total Messages Processed: ${this.processedMessages.length}`)
    );

    if (this.processedMessages.length > 0) {
      const totalTime =
        Math.max(...this.processedMessages.map((r) => r.endTime)) -
        Math.min(...this.processedMessages.map((r) => r.startTime));

      console.log(chalk.white(`Total Processing Time: ${totalTime}ms`));
      console.log(chalk.white("Processing Order:"));

      this.processedMessages.forEach((result, index) => {
        console.log(
          chalk.gray(
            `  ${index + 1}. Message ${result.messageId} - ${
              result.processingDuration
            }ms`
          )
        );
      });

      console.log(
        chalk.green(
          "✅ Messages were processed SEQUENTIALLY (one after another)"
        )
      );
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  start(): void {
    console.log(chalk.blue(`🚀 Sequential worker started (concurrency=1)`));
    console.log(chalk.gray(`Worker ID: ${this.workerId}`));
    console.log(chalk.yellow("Press Ctrl+C to stop and see summary\n"));
  }
}

// Start the worker
const worker = new SequentialWorker();
worker.start();
