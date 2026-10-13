import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { EventsModule } from '../events/events.module.js';
import { TenantsModule } from '../tenants/tenants.module.js';
import { LlmGateway } from './application/ports/llm-gateway.js';
import { MallKnowledgeProvider } from './application/ports/mall-knowledge-provider.js';
import { AskChatbotUseCase } from './application/use-cases/ask-chatbot.use-case.js';
import { GeminiLlmGateway } from './infrastructure/gemini-llm-gateway.js';
import { RepositoryMallKnowledgeProvider } from './infrastructure/repository-mall-knowledge-provider.js';
import { UnconfiguredLlmGateway } from './infrastructure/unconfigured-llm-gateway.js';
import { ChatController } from './presentation/http/chat.controller.js';

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const DEFAULT_MAX_OUTPUT_TOKENS = 1024;
const REQUEST_TIMEOUT_MS = 30_000;

@Module({
  imports: [TenantsModule, EventsModule],
  controllers: [ChatController],
  providers: [
    AskChatbotUseCase,
    { provide: MallKnowledgeProvider, useClass: RepositoryMallKnowledgeProvider },
    {
      provide: LlmGateway,
      inject: [ConfigService],
      useFactory: (config: ConfigService): LlmGateway => {
        const apiKey = config.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
          new Logger('ChatModule').warn(
            'GEMINI_API_KEY is not set, the chatbot will answer 503',
          );
          return new UnconfiguredLlmGateway();
        }
        return new GeminiLlmGateway(
          new GoogleGenAI({ apiKey, httpOptions: { timeout: REQUEST_TIMEOUT_MS } }),
          {
            model: config.get<string>('CHAT_MODEL') ?? DEFAULT_MODEL,
            maxOutputTokens: Number(
              config.get('CHAT_MAX_OUTPUT_TOKENS') ?? DEFAULT_MAX_OUTPUT_TOKENS,
            ),
          },
        );
      },
    },
  ],
})
export class ChatModule {}
