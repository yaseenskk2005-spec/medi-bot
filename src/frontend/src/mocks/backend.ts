import type { backendInterface, BotResponse, TransformationInput, TransformationOutput } from "../backend";
import { MessageRole } from "../backend";

export const mockBackend: backendInterface = {
  clearHistory: async (): Promise<void> => {
    return undefined;
  },

  getSuggestions: async (): Promise<Array<string>> => {
    return [
      "What are the symptoms of type 2 diabetes?",
      "How can I lower my blood pressure naturally?",
      "What should I know about common cold remedies?",
      "Tell me about recommended daily vitamin intake",
      "What are warning signs of a heart attack?",
      "How does sleep affect my overall health?",
    ];
  },

  sendMessage: async (userMessage: string): Promise<BotResponse> => {
    return {
      metadata: {
        model: "MediBot AI v1.0",
        processingTimeMs: BigInt(320),
        tokenEstimate: BigInt(85),
      },
      message: {
        content:
          "Thank you for your question. Based on general medical knowledge, I can provide some information, but please note this is not a substitute for professional medical advice. It's always best to consult with a qualified healthcare provider for personalized guidance regarding your specific situation.",
        role: MessageRole.assistant,
        timestamp: BigInt(Date.now()),
      },
    };
  },

  transform: async (input: TransformationInput): Promise<TransformationOutput> => {
    return {
      status: BigInt(200),
      body: new Uint8Array(),
      headers: [],
    };
  },
};
