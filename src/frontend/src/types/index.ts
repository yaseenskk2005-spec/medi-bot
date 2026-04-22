export enum MessageRole {
  user = "user",
  assistant = "assistant",
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: bigint;
}

export interface ResponseMetadata {
  model: string;
  processingTimeMs: bigint;
  tokenEstimate: bigint;
}

export interface BotResponse {
  message: ChatMessage;
  metadata: ResponseMetadata;
}

export type Theme = "light" | "dark" | "system";
