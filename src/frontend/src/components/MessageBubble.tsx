import { Activity, AlertTriangle, User } from "lucide-react";
import type { ChatMessage } from "../types";
import { MessageRole } from "../types";

interface MessageBubbleProps {
  message: ChatMessage;
  processingTimeMs?: bigint;
  isError?: boolean;
  index: number;
}

function formatTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp));
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatProcessing(ms: bigint): string {
  const seconds = Number(ms) / 1000;
  return seconds < 1 ? `${Number(ms)}ms` : `${seconds.toFixed(1)}s`;
}

export default function MessageBubble({
  message,
  processingTimeMs,
  isError = false,
  index,
}: MessageBubbleProps) {
  const isUser = message.role === MessageRole.user;

  if (isUser) {
    return (
      <div
        className="flex items-end justify-end gap-3 animate-message-in"
        data-ocid={`message.item.${index}`}
      >
        <div className="flex flex-col items-end gap-1 max-w-[72%] md:max-w-[60%]">
          <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-primary text-primary-foreground shadow-medical">
            <p className="text-sm font-body leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono pr-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-secondary/30 border border-secondary/40">
          <User
            className="w-4 h-4 text-secondary-foreground"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-end gap-3 animate-message-in"
      data-ocid={`message.item.${index}`}
    >
      {/* Bot avatar */}
      <div
        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border ${
          isError
            ? "bg-destructive/10 border-destructive/30"
            : "bg-primary/20 border-primary/30"
        }`}
      >
        {isError ? (
          <AlertTriangle
            className="w-4 h-4 text-destructive"
            aria-hidden="true"
          />
        ) : (
          <Activity className="w-4 h-4 text-primary" aria-hidden="true" />
        )}
      </div>

      {/* Message content */}
      <div className="flex flex-col items-start gap-1 max-w-[72%] md:max-w-[65%]">
        <div
          className={`px-4 py-3 rounded-2xl rounded-bl-sm shadow-medical border ${
            isError
              ? "bg-destructive/5 border-destructive/20 text-destructive"
              : "bg-card border-border text-foreground"
          }`}
        >
          <p className="text-sm font-body leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <div className="flex items-center gap-2 pl-1">
          <span className="text-[10px] text-muted-foreground font-mono">
            {formatTime(message.timestamp)}
          </span>
          {processingTimeMs !== undefined && (
            <span className="text-[10px] text-primary/60 font-mono">
              · {formatProcessing(processingTimeMs)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
