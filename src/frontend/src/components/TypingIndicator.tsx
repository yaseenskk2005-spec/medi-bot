import { Activity } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div
      className="flex items-end gap-3 animate-message-in"
      aria-live="polite"
      aria-label="Medi Bot is typing"
      data-ocid="typing_indicator"
    >
      {/* Bot avatar */}
      <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border border-primary/30">
        <Activity className="w-4 h-4 text-primary" aria-hidden="true" />
      </div>

      {/* Bubble */}
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-card border border-border shadow-medical">
        <span
          className="w-2 h-2 rounded-full bg-primary animate-typing-1"
          aria-hidden="true"
        />
        <span
          className="w-2 h-2 rounded-full bg-primary animate-typing-2"
          aria-hidden="true"
        />
        <span
          className="w-2 h-2 rounded-full bg-primary animate-typing-3"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
