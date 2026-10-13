import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiEnvelopeResponse } from '../../../../shared/presentation/http/api-envelope-response.decorator.js';
import { AskChatbotUseCase } from '../../application/use-cases/ask-chatbot.use-case.js';
import { AskQuestionDto } from './dto/ask-question.dto.js';
import { ChatAnswerResponse } from './dto/chat-answer.response.js';

@ApiTags('chat')
@Controller('chat')
@UseGuards(ThrottlerGuard)
export class ChatController {
  constructor(private readonly askChatbot: AskChatbotUseCase) {}

  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiEnvelopeResponse(ChatAnswerResponse)
  ask(@Body() body: AskQuestionDto): Promise<ChatAnswerResponse> {
    return this.askChatbot.execute(body);
  }
}
