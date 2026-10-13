import { Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../../shared/domain/domain.error.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { MallEvent } from '../../domain/mall-event.entity.js';
import { MallEventRepository } from '../../domain/mall-event.repository.js';

@Injectable()
export class GetEventUseCase implements UseCase<{ id: string }, MallEvent> {
  constructor(private readonly events: MallEventRepository) {}

  async execute({ id }: { id: string }): Promise<MallEvent> {
    const event = await this.events.findById(id);
    if (!event) {
      throw new NotFoundError(`Event ${id} not found`);
    }
    return event;
  }
}
