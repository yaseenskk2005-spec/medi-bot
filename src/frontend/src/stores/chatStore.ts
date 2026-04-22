import { create } from "zustand";
import type { ChatMessage } from "../types";
import { MessageRole } from "../types";

let idCounter = 0;
function nextId() {
  return `msg-${++idCounter}-${Date.now()}`;
}

interface ActorLike {
  sendMessage(userMessage: string): Promise<{
    message: { content: string; role: MessageRole; timestamp: bigint };
    metadata: {
      model: string;
      processingTimeMs: bigint;
      tokenEstimate: bigint;
    };
  }>;
  clearHistory(): Promise<void>;
  getSuggestions(): Promise<string[]>;
}

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  suggestions: string[];
  sendMessage: (content: string, actor: ActorLike) => Promise<void>;
  clearMessages: (actor: ActorLike) => Promise<void>;
  loadSuggestions: (actor: ActorLike) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  suggestions: [],

  sendMessage: async (content, actor) => {
    if (get().isLoading) return;

    const userMsg: ChatMessage = {
      id: nextId(),
      role: MessageRole.user,
      content,
      timestamp: BigInt(Date.now()),
    };

    set((s) => ({ messages: [...s.messages, userMsg], isLoading: true }));

    try {
      const resp = await actor.sendMessage(content);
      const assistantMsg: ChatMessage = {
        id: nextId(),
        role: MessageRole.assistant,
        content: resp.message.content,
        timestamp: resp.message.timestamp,
      };
      set((s) => ({ messages: [...s.messages, assistantMsg] }));
    } catch {
      const errorMsg: ChatMessage = {
        id: nextId(),
        role: MessageRole.assistant,
        content:
          "I'm sorry, I encountered an issue processing your request. Please try again.",
        timestamp: BigInt(Date.now()),
      };
      set((s) => ({ messages: [...s.messages, errorMsg] }));
    } finally {
      set({ isLoading: false });
    }
  },

  clearMessages: async (actor) => {
    try {
      await actor.clearHistory();
    } catch {
      // best-effort clear
    }
    set({ messages: [] });
  },

  loadSuggestions: async (actor) => {
    try {
      const suggestions = await actor.getSuggestions();
      set({ suggestions });
    } catch {
      set({
        suggestions: [
          "What are common symptoms of the flu?",
          "How can I improve my sleep quality?",
          "What should I know about blood pressure?",
          "How often should I exercise for heart health?",
        ],
      });
    }
  },
}));
