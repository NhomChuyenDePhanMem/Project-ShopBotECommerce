import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ChatbotService } from './chatbot.service';
import { CHAT_CONTEXT_WINDOW, CHAT_TOKEN_LIMIT } from '../../common/mock-data';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('config')
  getConfig() {
    return {
      contextWindowSize: CHAT_CONTEXT_WINDOW,
      tokenLimit: CHAT_TOKEN_LIMIT,
      note: 'MVP config for ChatSession + ChatMessage context handling',
    };
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('messages')
  sendMessage(@Body() body: { message?: string; sessionId?: string }) {
    const content = body.message?.trim() ?? '';
    if (!content) {
      return { text: 'Noi dung tin nhan khong duoc de trong.', products: [] };
    }

    return this.chatbotService.reply(content, body.sessionId);
  }
}
