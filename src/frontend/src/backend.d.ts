import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BotResponse {
    metadata: ResponseMetadata;
    message: ChatMessage;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface ChatMessage {
    content: string;
    role: MessageRole;
    timestamp: Timestamp;
}
export interface ResponseMetadata {
    model: string;
    processingTimeMs: bigint;
    tokenEstimate: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum MessageRole {
    user = "user",
    assistant = "assistant"
}
export interface backendInterface {
    clearHistory(): Promise<void>;
    getSuggestions(): Promise<Array<string>>;
    sendMessage(userMessage: string): Promise<BotResponse>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
