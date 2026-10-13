import { MallKnowledge } from '../../domain/mall-knowledge.js';
import { ChatPrompt, LlmCompletion, LlmGateway } from '../ports/llm-gateway.js';
import { MallKnowledgeProvider } from '../ports/mall-knowledge-provider.js';
import { AskChatbotUseCase, NO_ANSWER_MESSAGE } from './ask-chatbot.use-case.js';

class StubKnowledge extends MallKnowledgeProvider {
  constructor(private readonly knowledge: MallKnowledge) {
    super();
  }

  async gather(): Promise<MallKnowledge> {
    return this.knowledge;
  }
}

class RecordingLlm extends LlmGateway {
  prompts: ChatPrompt[] = [];

  constructor(private readonly completion: LlmCompletion) {
    super();
  }

  async complete(prompt: ChatPrompt): Promise<LlmCompletion> {
    this.prompts.push(prompt);
    return this.completion;
  }
}

const pharmacy = {
  nameEn: 'City Pharmacy',
  nameKm: 'ឱសថស្ថានស៊ីធី',
  categoryEn: 'Pharmacy',
  categoryKm: 'ឱសថស្ថាន',
  descriptionEn: '',
  descriptionKm: '',
  floor: 2,
  opensAt: '09:00',
  closesAt: '21:00',
};

const answered = { text: 'The pharmacy is on floor 2.', refused: false };

describe('AskChatbotUseCase', () => {
  it('does not call the model when nothing in the mall data matches', async () => {
    const llm = new RecordingLlm(answered);
    const useCase = new AskChatbotUseCase(
      new StubKnowledge(new MallKnowledge([], [])),
      llm,
    );

    const result = await useCase.execute({ question: 'What is the capital of France?' });

    expect(result).toEqual({ answer: NO_ANSWER_MESSAGE, grounded: false });
    expect(llm.prompts).toHaveLength(0);
  });

  it('sends the matching mall data and the question to the model', async () => {
    const llm = new RecordingLlm(answered);
    const useCase = new AskChatbotUseCase(
      new StubKnowledge(new MallKnowledge([pharmacy], [])),
      llm,
    );

    const result = await useCase.execute({ question: 'Where is the pharmacy?' });

    expect(result).toEqual({ answer: 'The pharmacy is on floor 2.', grounded: true });
    expect(llm.prompts[0].user).toContain('City Pharmacy');
    expect(llm.prompts[0].user).toContain('Where is the pharmacy?');
  });

  it('answers that it does not know when the model refuses', async () => {
    const useCase = new AskChatbotUseCase(
      new StubKnowledge(new MallKnowledge([pharmacy], [])),
      new RecordingLlm({ text: '', refused: true }),
    );

    const result = await useCase.execute({ question: 'Where is the pharmacy?' });

    expect(result).toEqual({ answer: NO_ANSWER_MESSAGE, grounded: false });
  });
});
