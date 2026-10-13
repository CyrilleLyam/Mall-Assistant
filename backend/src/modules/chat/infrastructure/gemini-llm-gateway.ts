import { Logger } from '@nestjs/common';
import { BlockedReason, FinishReason, GoogleGenAI } from '@google/genai';
import { ServiceUnavailableError } from '../../../shared/domain/domain.error.js';
import {
  ChatPrompt,
  LlmCompletion,
  LlmGateway,
} from '../application/ports/llm-gateway.js';

export interface GeminiLlmGatewayOptions {
  model: string;
  maxOutputTokens: number;
}

const REFUSAL_FINISH_REASONS = new Set<FinishReason | undefined>([
  FinishReason.SAFETY,
  FinishReason.PROHIBITED_CONTENT,
  FinishReason.BLOCKLIST,
  FinishReason.SPII,
]);

export class GeminiLlmGateway extends LlmGateway {
  private readonly logger = new Logger(GeminiLlmGateway.name);

  constructor(
    private readonly client: GoogleGenAI,
    private readonly options: GeminiLlmGatewayOptions,
  ) {
    super();
  }

  async complete(prompt: ChatPrompt): Promise<LlmCompletion> {
    const response = await this.client.models
      .generateContent({
        model: this.options.model,
        contents: prompt.user,
        config: {
          systemInstruction: prompt.system,
          maxOutputTokens: this.options.maxOutputTokens,
        },
      })
      .catch((error: unknown) => {
        this.logger.error(`Gemini request failed: ${String(error)}`);
        throw new ServiceUnavailableError('The chatbot is temporarily unavailable');
      });

    const blockReason = response.promptFeedback?.blockReason;
    const finishReason = response.candidates?.[0]?.finishReason;
    if (
      (blockReason !== undefined &&
        blockReason !== BlockedReason.BLOCKED_REASON_UNSPECIFIED) ||
      REFUSAL_FINISH_REASONS.has(finishReason)
    ) {
      return { text: '', refused: true };
    }

    const text = response.text?.trim();
    if (!text) {
      this.logger.warn(`Gemini returned no text (finish reason: ${finishReason})`);
      throw new ServiceUnavailableError('The chatbot is temporarily unavailable');
    }
    return { text, refused: false };
  }
}
