import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.js';
import { buildChatPrompt } from '../chat-prompt.builder.js';
import { LlmGateway } from '../ports/llm-gateway.js';
import { MallKnowledgeProvider } from '../ports/mall-knowledge-provider.js';

export const NO_ANSWER_MESSAGE =
  "I'm sorry, I don't have information about that.";

export interface AskChatbotInput {
  question: string;
}

export interface AskChatbotOutput {
  answer: string;
  grounded: boolean;
}

@Injectable()
export class AskChatbotUseCase
  implements UseCase<AskChatbotInput, AskChatbotOutput>
{
  constructor(
    private readonly knowledgeProvider: MallKnowledgeProvider,
    private readonly llm: LlmGateway,
  ) {}

  async execute({ question }: AskChatbotInput): Promise<AskChatbotOutput> {
    const knowledge = await this.knowledgeProvider.gather(question);
    if (knowledge.isEmpty) {
      return { answer: NO_ANSWER_MESSAGE, grounded: false };
    }

    const completion = await this.llm.complete(
      buildChatPrompt(question, knowledge),
    );
    if (completion.refused) {
      return { answer: NO_ANSWER_MESSAGE, grounded: false };
    }
    return { answer: completion.text, grounded: true };
  }
}
