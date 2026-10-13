import { Injectable } from '@nestjs/common';
import { Clock } from '../../../../shared/application/clock.js';
import type { Page, PageRequest } from '../../../../shared/application/page.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { MallEvent } from '../../domain/mall-event.entity.js';
import { MallEventRepository } from '../../domain/mall-event.repository.js';

export type ListEventsInput = PageRequest & {
  status?: 'current' | 'upcoming';
};

@Injectable()
export class ListEventsUseCase implements UseCase<ListEventsInput, Page<MallEvent>> {
  constructor(
    private readonly events: MallEventRepository,
    private readonly clock: Clock,
  ) {}

  execute({ status, page, pageSize }: ListEventsInput): Promise<Page<MallEvent>> {
    return this.events.listPage({ status, today: this.clock.today() }, { page, pageSize });
  }
}
