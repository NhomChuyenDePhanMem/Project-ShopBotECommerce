import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import {
  CHAT_CONTEXT_WINDOW,
  CHAT_TOKEN_LIMIT,
  mockChatMessages,
  mockChatSessions,
} from '../../common/mock-data';

const SYSTEM_PROMPT = `
Ban la tro ly tu van cua ShopBot.
- Chi tra loi cac noi dung lien quan den san pham, don hang, khuyen mai, bao hanh.
- Neu ngoai pham vi thuong mai dien tu, lich su don, hoac tu van mua sam, hay tu choi lich su.
- Khuyen nghi ngan gon, ro rang, uu tien ngan sach cua nguoi dung.
`.trim();

const BLOCKED_PATTERNS = [/hack/i, /sql\s*injection/i, /bypass/i, /danhsach\s*the\s*tin\s*dung/i];
const MAX_SESSION_BUDGET_TOKENS = 4_000;

@Injectable()
export class ChatbotService {
  constructor(private readonly productsService: ProductsService) {}

  private estimateTokens(text: string) {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }

  private isModerated(message: string) {
    return BLOCKED_PATTERNS.some((pattern) => pattern.test(message));
  }

  private getOrCreateSession(sessionId?: string) {
    const existing = sessionId ? mockChatSessions.find((item) => item.id === sessionId) : undefined;
    if (existing) {
      return existing;
    }

    const created = {
      id: `cs${mockChatSessions.length + 1}`,
      userId: 'u1',
      startedAt: new Date().toISOString(),
    };
    mockChatSessions.push(created);
    return created;
  }

  private getSessionContext(sessionId: string) {
    const messages = mockChatMessages.filter((item) => item.sessionId === sessionId);
    const reversed = [...messages].reverse();
    const selected: typeof messages = [];
    let tokens = 0;

    for (const message of reversed) {
      if (selected.length >= CHAT_CONTEXT_WINDOW) {
        break;
      }
      if (tokens + message.estimatedTokens > CHAT_TOKEN_LIMIT) {
        break;
      }
      tokens += message.estimatedTokens;
      selected.push(message);
    }

    return {
      windowSize: CHAT_CONTEXT_WINDOW,
      tokenLimit: CHAT_TOKEN_LIMIT,
      contextTokens: tokens,
      messages: selected.reverse(),
    };
  }

  private replyRuleBased(message: string) {
    const normalized = message.toLowerCase();
    const budgetMatch = normalized.match(/(\d{1,3})(tr|m|k)/);

    if (budgetMatch) {
      const value = Number(budgetMatch[1]);
      const unit = budgetMatch[2];
      const budget =
        unit === 'tr' ? value * 1_000_000 : unit === 'm' ? value * 1_000_000 : value * 1_000;

      const products = this.productsService.findTopByBudget(budget);
      return {
        text: `Muc ngan sach ${budget.toLocaleString('vi-VN')} VND co ${products.length} goi y phu hop.`,
        products,
      };
    }

    const products = this.productsService.findAll({ q: message }).slice(0, 3);
    if (products.length > 0) {
      return {
        text: 'Minh da tim thay mot so san pham lien quan. Ban muon so sanh chi tiet khong?',
        products,
      };
    }

    return {
      text: 'Ban thu mo ta nhu cau ro hon (vi du: laptop hoc tap duoi 20tr) de minh goi y chinh xac hon.',
      products: [],
    };
  }

  reply(message: string, sessionId?: string) {
    const session = this.getOrCreateSession(sessionId);
    const questionTokens = this.estimateTokens(message);

    const totalSessionTokens = mockChatMessages
      .filter((item) => item.sessionId === session.id)
      .reduce((sum, item) => sum + item.estimatedTokens, 0);

    if (totalSessionTokens + questionTokens > MAX_SESSION_BUDGET_TOKENS) {
      return {
        sessionId: session.id,
        text: 'Ban da dung qua ngan sach chat cua phien nay. Vui long mo phien chat moi.',
        products: [],
        fallbackUsed: true,
        context: this.getSessionContext(session.id),
      };
    }

    if (this.isModerated(message)) {
      return {
        sessionId: session.id,
        text: 'Noi dung khong hop le theo chinh sach an toan. Vui long dat cau hoi ve mua sam hoac don hang.',
        products: [],
        moderated: true,
        context: this.getSessionContext(session.id),
      };
    }

    mockChatMessages.push({
      id: `cm${mockChatMessages.length + 1}`,
      sessionId: session.id,
      role: 'user',
      content: message,
      estimatedTokens: questionTokens,
      sentAt: new Date().toISOString(),
    });

    const context = this.getSessionContext(session.id);
    const shouldFallback = process.env.CHATBOT_FORCE_DOWN === 'true';
    const aiResponse = shouldFallback
      ? {
          text: 'AI tam thoi khong kha dung. He thong dang fallback sang tu van rule-based.',
          products: [],
        }
      : this.replyRuleBased(message);

    const assistantText = `${aiResponse.text}\n\n[system] ${SYSTEM_PROMPT}`;
    mockChatMessages.push({
      id: `cm${mockChatMessages.length + 1}`,
      sessionId: session.id,
      role: 'assistant',
      content: assistantText,
      estimatedTokens: this.estimateTokens(assistantText),
      sentAt: new Date().toISOString(),
    });

    return {
      sessionId: session.id,
      text: aiResponse.text,
      products: aiResponse.products,
      fallbackUsed: shouldFallback,
      context,
      budget: {
        maxTokens: MAX_SESSION_BUDGET_TOKENS,
        usedTokens:
          totalSessionTokens + questionTokens + this.estimateTokens(assistantText),
      },
    };
  }
}
