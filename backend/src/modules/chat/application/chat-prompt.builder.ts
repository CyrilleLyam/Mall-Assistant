import { MallKnowledge } from '../domain/mall-knowledge.js';
import { ChatPrompt } from './ports/llm-gateway.js';

const SYSTEM_PROMPT = [
  'You are Mall Assistant, a guide for shoppers in a shopping mall.',
  'Answer only with facts found in the MALL DATA block. Never invent stores, floors, opening hours or promotions.',
  'If the MALL DATA does not contain the answer, say that you do not know.',
  'Reply in the same language as the question (Khmer or English) and keep the answer short.',
].join('\n');

export function buildChatPrompt(
  question: string,
  knowledge: MallKnowledge,
): ChatPrompt {
  const data = JSON.stringify({
    stores: knowledge.stores,
    events: knowledge.events,
  });

  return {
    system: SYSTEM_PROMPT,
    user: `MALL DATA (JSON):\n${data}\n\nQUESTION:\n${question}`,
  };
}
