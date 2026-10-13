export interface ChatPrompt {
  system: string;
  user: string;
}

export interface LlmCompletion {
  text: string;
  refused: boolean;
}

export abstract class LlmGateway {
  abstract complete(prompt: ChatPrompt): Promise<LlmCompletion>;
}
