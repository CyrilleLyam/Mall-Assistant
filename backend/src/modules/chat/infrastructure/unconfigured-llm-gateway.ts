import { Injectable } from '@nestjs/common';
import { ServiceUnavailableError } from '../../../shared/domain/domain.error.js';
import {
  ChatPrompt,
  LlmCompletion,
  LlmGateway,
} from '../application/ports/llm-gateway.js';

@Injectable()
export class UnconfiguredLlmGateway extends LlmGateway {
  complete(_prompt: ChatPrompt): Promise<LlmCompletion> {
    return Promise.reject(
      new ServiceUnavailableError('The chatbot is not configured yet'),
    );
  }
}
