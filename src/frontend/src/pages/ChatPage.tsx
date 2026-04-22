import { useActor } from "@caffeineai/core-infrastructure";
import {
  Activity,
  Brain,
  Heart,
  Moon,
  Pill,
  SendHorizonal,
  Stethoscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppContext } from "../App";
import { createActor } from "../backend";
import ClearChatModal from "../components/ClearChatModal";
import MessageBubble from "../components/MessageBubble";
import SuggestionCard from "../components/SuggestionCard";
import TypingIndicator from "../components/TypingIndicator";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useChatStore } from "../stores/chatStore";
import { MessageRole } from "../types";

interface SuggestionItem {
  icon: LucideIcon;
  label: string;
}

const DEFAULT_SUGGESTIONS: SuggestionItem[] = [
  { icon: Heart, label: "What are common symptoms of high blood pressure?" },
  {
    icon: Brain,
    label: "How can I improve my mental health and reduce stress?",
  },
  { icon: Stethoscope, label: "When should I see a doctor for chest pain?" },
  {
    icon: Pill,
    label: "What should I know about common over-the-counter medications?",
  },
  {
    icon: Activity,
    label: "How much exercise is recommended for heart health?",
  },
  { icon: Moon, label: "What are the best tips for improving sleep quality?" },
];

function EmptyState({ onSuggest }: { onSuggest: (text: string) => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-full py-10 px-4"
      data-ocid="empty_state"
    >
      {/* Logo mark */}
      <div className="relative mb-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/15 border border-primary/30 shadow-elevated">
          <Activity className="w-10 h-10 text-primary" aria-hidden="true" />
        </div>
        <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground shadow-medical">
          AI
        </span>
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-2">
        Medi Bot
      </h1>
      <p className="text-sm text-muted-foreground font-body text-center max-w-sm mb-1">
        Your intelligent medical information assistant
      </p>
      <p className="text-xs text-muted-foreground/70 font-body text-center max-w-xs mb-8">
        Ask me about symptoms, medications, wellness, or general health
        questions
      </p>

      {/* Suggestion grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl"
        data-ocid="suggestions.list"
      >
        {DEFAULT_SUGGESTIONS.map((s) => (
          <SuggestionCard
            key={s.label}
            icon={s.icon}
            label={s.label}
            onClick={() => onSuggest(s.label)}
            index={DEFAULT_SUGGESTIONS.indexOf(s) + 1}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { actor } = useActor(createActor);
  const { messages, isLoading, sendMessage, loadSuggestions } = useChatStore();
  const { onClearChat } = useAppContext();

  const [input, setInput] = useState("");
  const [showClearModal, setShowClearModal] = useState(false);
  const [processingTimes, setProcessingTimes] = useState<
    Record<string, bigint>
  >({});

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load suggestions on mount
  useEffect(() => {
    if (actor) loadSuggestions(actor);
  }, [actor, loadSuggestions]);

  // Auto-scroll to bottom when new messages arrive or loading state changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally trigger on message count and loading flag
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  // Wire clear modal to app-level clear
  const handleConfirmClear = useCallback(async () => {
    setShowClearModal(false);
    await onClearChat();
    setProcessingTimes({});
  }, [onClearChat]);

  // Open modal on clear button
  useEffect(() => {
    // Expose setShowClearModal via custom event so Layout can trigger it
    const handler = () => setShowClearModal(true);
    window.addEventListener("medibot:open-clear-modal", handler);
    return () =>
      window.removeEventListener("medibot:open-clear-modal", handler);
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading || !actor) return;
    setInput("");
    textareaRef.current?.focus();

    const startTime = Date.now();
    const prevCount = messages.length;
    await sendMessage(text, actor);

    // Record processing time for the new assistant message
    const newMessages = useChatStore.getState().messages;
    if (newMessages.length > prevCount) {
      const lastMsg = newMessages[newMessages.length - 1];
      if (lastMsg.role === MessageRole.assistant) {
        const elapsed = BigInt(Date.now() - startTime);
        setProcessingTimes((prev) => ({ ...prev, [lastMsg.id]: elapsed }));
      }
    }
  }, [input, isLoading, actor, messages.length, sendMessage]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleSuggest = useCallback(
    (text: string) => {
      if (!actor || isLoading) return;
      setInput(text);
      // Send immediately
      setTimeout(async () => {
        setInput("");
        await sendMessage(text, actor);
      }, 0);
    },
    [actor, isLoading, sendMessage],
  );

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Chat content */}
      <div className="flex flex-col min-h-full">
        {hasMessages ? (
          <div className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full space-y-5">
            {messages.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                processingTimeMs={
                  msg.role === MessageRole.assistant
                    ? processingTimes[msg.id]
                    : undefined
                }
                index={idx + 1}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        ) : (
          <EmptyState onSuggest={handleSuggest} />
        )}
      </div>

      {/* Chat input — rendered in a portal-like fixed bar inside chat area */}
      <div
        className="sticky bottom-0 bg-background border-t border-border shadow-elevated px-4 py-3"
        data-ocid="chat_input_bar"
      >
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a health question… (Enter to send, Shift+Enter for newline)"
              aria-label="Chat message input"
              data-ocid="chat.input"
              rows={1}
              disabled={isLoading}
              className="resize-none min-h-[44px] max-h-36 pr-2 font-body text-sm leading-relaxed bg-card border-input focus-visible:ring-ring transition-smooth overflow-y-auto"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !actor}
            aria-label="Send message"
            data-ocid="chat.submit_button"
            size="icon"
            className="w-11 h-11 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-medical transition-smooth disabled:opacity-40"
          >
            <SendHorizonal className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground font-mono text-center mt-2 max-w-3xl mx-auto">
          For emergencies, call 911 or your local emergency number immediately.
        </p>
      </div>

      {/* Clear confirmation modal */}
      <ClearChatModal
        open={showClearModal}
        onOpenChange={setShowClearModal}
        onConfirm={handleConfirmClear}
      />
    </>
  );
}
