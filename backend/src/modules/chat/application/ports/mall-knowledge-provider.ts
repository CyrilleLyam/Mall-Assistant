import { MallKnowledge } from '../../domain/mall-knowledge.js';

export abstract class MallKnowledgeProvider {
  abstract gather(question: string): Promise<MallKnowledge>;
}
