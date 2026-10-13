import type { Page, PageRequest } from '../../../shared/application/page.js';
import { MallEvent } from './mall-event.entity.js';

export interface MallEventListCriteria {
  status?: 'current' | 'upcoming';
  today: string;
}

export abstract class MallEventRepository {
  abstract list(criteria: MallEventListCriteria): Promise<MallEvent[]>;
  abstract listPage(
    criteria: MallEventListCriteria,
    page: PageRequest,
  ): Promise<Page<MallEvent>>;
  abstract findById(id: string): Promise<MallEvent | null>;
  abstract save(event: MallEvent): Promise<void>;
  abstract delete(id: string): Promise<boolean>;
}
