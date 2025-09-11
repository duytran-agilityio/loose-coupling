import { ConnectionOptions } from "bullmq";

export const redisConfig: ConnectionOptions = {
  host: "localhost",
  port: 6379,
  // Add password if your Redis instance requires it
  //   password: "your-password",

  // Optional: Add more Redis configuration
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

export const QUEUE_NAME = "message-processing-queue";
