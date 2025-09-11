import { Queue } from "bullmq";
import chalk from "chalk";
import { redisConfig, QUEUE_NAME } from "./config/redis";
import { MessageData } from "./config/types";

class MessageProducer {
  private queue: Queue;

  constructor() {
    this.queue = new Queue(QUEUE_NAME, {
      connection: redisConfig,
    });
  }

  async addMessages(count: number = 10): Promise<void> {
    console.log(chalk.blue(`🚀 Adding ${count} messages to queue...`));

    const jobs = [];
    for (let i = 1; i <= count; i++) {
      const messageData: MessageData = {
        id: i,
        message: `Message ${i}`,
        timestamp: Date.now(),
        processingTime: Math.random() * 3000 + 1000, // Random processing time between 1-4 seconds
      };

      // Add job to queue with a delay to see ordering effects
      const job = this.queue.add(`message-${i}`, messageData, {
        // Optional: Add delay between jobs
        // delay: i * 100,
      });

      jobs.push(job);
      console.log(
        chalk.green(
          `✓ Queued: ${messageData.message} (${Math.round(
            messageData.processingTime
          )}ms processing time)`
        )
      );
    }

    await Promise.all(jobs);
    console.log(
      chalk.blue(`📤 All ${count} messages added to queue successfully!`)
    );
  }

  async getQueueStats(): Promise<void> {
    const waiting = await this.queue.getWaiting();
    const active = await this.queue.getActive();
    const completed = await this.queue.getCompleted();
    const failed = await this.queue.getFailed();

    console.log(chalk.yellow("\n📊 Queue Statistics:"));
    console.log(`  Waiting: ${waiting.length}`);
    console.log(`  Active: ${active.length}`);
    console.log(`  Completed: ${completed.length}`);
    console.log(`  Failed: ${failed.length}`);
  }

  async cleanup(): Promise<void> {
    await this.queue.obliterate();
    await this.queue.close();
    console.log(chalk.red("🧹 Queue cleaned up and closed"));
  }
}

async function main() {
  const producer = new MessageProducer();

  try {
    const messageCount = parseInt(process.argv[2]) || 10;

    // Clean up any previous jobs
    await producer.cleanup();

    // Recreate queue after cleanup
    const cleanQueue = new Queue(QUEUE_NAME, { connection: redisConfig });
    const cleanProducer = new MessageProducer();

    await cleanProducer.addMessages(messageCount);
    await cleanProducer.getQueueStats();

    console.log(chalk.blue("\n🎯 Messages ready for processing!"));
    console.log(chalk.yellow("Run workers with:"));
    console.log(
      chalk.white("  Sequential (concurrency=1): npm run worker-sequential")
    );
    console.log(
      chalk.white("  Parallel (concurrency=5):   npm run worker-parallel")
    );
    console.log(
      chalk.white("  Multiple workers:           npm run multiple-workers")
    );
  } catch (error) {
    console.error(chalk.red("❌ Error in producer:"), error);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
