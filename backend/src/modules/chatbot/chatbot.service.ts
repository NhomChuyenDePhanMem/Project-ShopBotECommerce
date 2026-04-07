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
- Chi tra loi cac noi dung lien quan den ecommerce: san pham, bien the, gio hang, thanh toan, don hang, van chuyen, khuyen mai, bao hanh.
- Uu tien de xuat theo nhu cau + ngan sach + thuong hieu; neu thieu du lieu thi hoi lai 1 cau ngan.
- Neu ngoai pham vi thuong mai dien tu hoac yeu cau nguy hiem thi tu choi lich su.
`.trim();

const BLOCKED_PATTERNS = [
  /hack/i,
  /sql\s*injection/i,
  /bypass/i,
  /danhsach\s*the\s*tin\s*dung/i,
];
const MAX_SESSION_BUDGET_TOKENS = 4_000;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GEMINI_API_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';

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
    const existing = sessionId
      ? mockChatSessions.find((item) => item.id === sessionId)
      : undefined;
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
    const messages = mockChatMessages.filter(
      (item) => item.sessionId === sessionId,
    );
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

  private async replyOpenAI(message: string, sessionId: string) {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) return null;

    const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4.1-mini';
    const context = this.getSessionContext(sessionId);
    const productHints = (
      await this.productsService.findAll({ q: message })
    ).slice(0, 5);
    const productContext =
      productHints.length > 0
        ? `San pham lien quan:\n${productHints
            .map(
              (p) =>
                `- ${p.name} | ${Number(p.price).toLocaleString('vi-VN')} VND | ${p.brand} | rating ${p.rating}`,
            )
            .join('\n')}`
        : 'Khong co san pham lien quan trong CSDL.';

    const priorMessages = context.messages.slice(-6).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    const body = {
      model,
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'system',
          content:
            'Tra loi ngan gon bang tieng Viet co dau. Neu khong du du lieu thi noi ro va hoi them mot cau lam ro.',
        },
        { role: 'system', content: productContext },
        ...priorMessages,
        { role: 'user', content: message },
      ],
    };

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI request failed: ${response.status} ${errorBody}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error('OpenAI empty response');
    }

    return {
      text,
      products: productHints,
    };
  }

  private async replyGemini(message: string, sessionId: string) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) return null;

    const model = (
      process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash'
    ).replace(/^models\//, '');
    const context = this.getSessionContext(sessionId);
    const productHints = (
      await this.productsService.findAll({ q: message })
    ).slice(0, 5);
    const productContext =
      productHints.length > 0
        ? `San pham lien quan:\n${productHints
            .map(
              (p) =>
                `- ${p.name} | ${Number(p.price).toLocaleString('vi-VN')} VND | ${p.brand} | rating ${p.rating}`,
            )
            .join('\n')}`
        : 'Khong co san pham lien quan trong CSDL.';

    const transcript = context.messages
      .slice(-6)
      .map(
        (m) => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${m.content}`,
      )
      .join('\n');

    const prompt = [
      SYSTEM_PROMPT,
      'Tra loi ngan gon bang tieng Viet co dau. Neu thieu du lieu thi hoi them mot cau lam ro.',
      productContext,
      transcript ? `Hoi thoai truoc do:\n${transcript}` : '',
      `Cau hoi hien tai: ${message}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    const response = await fetch(
      `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4 },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini request failed: ${response.status} ${errorBody}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      throw new Error('Gemini empty response');
    }

    return {
      text,
      products: productHints,
    };
  }

  private async replyRuleBased(message: string) {
    const normalized = message.toLowerCase();
    const budgetMatch = normalized.match(/(\d{1,3})(tr|m|k)/);

    if (budgetMatch) {
      const value = Number(budgetMatch[1]);
      const unit = budgetMatch[2];
      const budget =
        unit === 'tr'
          ? value * 1_000_000
          : unit === 'm'
            ? value * 1_000_000
            : value * 1_000;

      const products = await this.productsService.findTopByBudget(budget);
      return {
        text: `Muc ngan sach ${budget.toLocaleString('vi-VN')} VND co ${products.length} goi y phu hop.`,
        products,
      };
    }

    const products = (await this.productsService.findAll({ q: message })).slice(
      0,
      3,
    );
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

  async reply(message: string, sessionId?: string) {
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
    // E2E / môi trường không gọi LLM ngoài
    const forceFallback = process.env.CHATBOT_FORCE_DOWN === 'true';
    const provider =
      process.env.CHATBOT_PROVIDER?.trim().toLowerCase() || 'openai';
    let fallbackUsed = false;
    let aiResponse: { text: string; products: unknown[] };
    let providerError: string | undefined;

    if (forceFallback || provider === 'rule_based') {
      fallbackUsed = true;
      aiResponse = await this.replyRuleBased(message);
    } else {
      try {
        const providerReply =
          provider === 'gemini'
            ? await this.replyGemini(message, session.id)
            : await this.replyOpenAI(message, session.id);
        if (!providerReply) {
          fallbackUsed = true;
          providerError = `${provider} provider not configured`;
          aiResponse = await this.replyRuleBased(message);
        } else {
          aiResponse = providerReply;
        }
      } catch (error) {
        fallbackUsed = true;
        providerError =
          error instanceof Error ? error.message : 'unknown provider error';
        aiResponse = await this.replyRuleBased(message);
      }
    }

    const assistantText = aiResponse.text;
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
      fallbackUsed,
      providerError,
      context,
      budget: {
        maxTokens: MAX_SESSION_BUDGET_TOKENS,
        usedTokens:
          totalSessionTokens +
          questionTokens +
          this.estimateTokens(assistantText),
      },
    };
  }
}
