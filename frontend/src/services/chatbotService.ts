import { api } from '../lib/apiClient';
import type { Product } from './productService';

export type ChatbotReply = {
  sessionId: string;
  text: string;
  products: Product[];
  fallbackUsed: boolean;
  providerError?: string;
};

export function sendChatMessage(message: string, sessionId?: string) {
  return api<ChatbotReply>('/chatbot/messages', {
    method: 'POST',
    body: JSON.stringify({ message, sessionId }),
  });
}

export function formatChatbotReplyForDisplay(reply: ChatbotReply): string {
  return reply.text;
}
