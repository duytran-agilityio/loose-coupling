export interface MessageData {
  id: number;
  message: string;
  timestamp: number;
  processingTime: number; // milliseconds to simulate work
}

export interface ProcessingResult {
  messageId: number;
  workerId: string;
  startTime: number;
  endTime: number;
  processingDuration: number;
}
