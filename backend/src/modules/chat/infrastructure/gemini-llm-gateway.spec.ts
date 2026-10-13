import { BlockedReason, FinishReason, type GoogleGenAI } from '@google/genai';
import { ServiceUnavailableError } from '../../../shared/domain/domain.error.js';
import { GeminiLlmGateway } from './gemini-llm-gateway.js';

interface FakeResponse {
  text?: string;
  candidates?: Array<{ finishReason?: FinishReason }>;
  promptFeedback?: { blockReason?: BlockedReason };
}

const prompt = { system: 'Only use the data.', user: 'DATA\n\nQUESTION: Where is the pharmacy?' };

function gatewayReturning(handler: (params: unknown) => Promise<FakeResponse>) {
  const generateContent = vi.fn(handler);
  const client = { models: { generateContent } } as unknown as GoogleGenAI;
  return {
    generateContent,
    gateway: new GeminiLlmGateway(client, { model: 'test-model', maxOutputTokens: 321 }),
  };
}

describe('GeminiLlmGateway', () => {
  it('sends the model, system instruction, user text and token cap', async () => {
    const { gateway, generateContent } = gatewayReturning(async () => ({
      text: '  The pharmacy is on floor 2.  ',
      candidates: [{ finishReason: FinishReason.STOP }],
    }));

    const result = await gateway.complete(prompt);

    expect(result).toEqual({ text: 'The pharmacy is on floor 2.', refused: false });
    expect(generateContent).toHaveBeenCalledWith({
      model: 'test-model',
      contents: prompt.user,
      config: { systemInstruction: prompt.system, maxOutputTokens: 321 },
    });
  });

  it('reports a refusal when the prompt is blocked', async () => {
    const { gateway } = gatewayReturning(async () => ({
      promptFeedback: { blockReason: BlockedReason.SAFETY },
    }));

    await expect(gateway.complete(prompt)).resolves.toEqual({ text: '', refused: true });
  });

  it('reports a refusal when generation stops for safety', async () => {
    const { gateway } = gatewayReturning(async () => ({
      candidates: [{ finishReason: FinishReason.SAFETY }],
    }));

    await expect(gateway.complete(prompt)).resolves.toEqual({ text: '', refused: true });
  });

  it('fails as unavailable when the model returns no text', async () => {
    const { gateway } = gatewayReturning(async () => ({
      candidates: [{ finishReason: FinishReason.MAX_TOKENS }],
    }));

    await expect(gateway.complete(prompt)).rejects.toBeInstanceOf(ServiceUnavailableError);
  });

  it('fails as unavailable when the request errors', async () => {
    const { gateway } = gatewayReturning(async () => {
      throw new Error('429 quota exceeded');
    });

    await expect(gateway.complete(prompt)).rejects.toBeInstanceOf(ServiceUnavailableError);
  });
});
