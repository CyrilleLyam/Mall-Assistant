import { Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../../shared/domain/domain.error.js';
import { omitUndefined } from '../../../../shared/application/omit-undefined.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { EventPeriod } from '../../domain/event-period.js';
import { MallEvent } from '../../domain/mall-event.entity.js';
import { MallEventRepository } from '../../domain/mall-event.repository.js';
import { EventDetails } from '../event-details.js';

export interface UpdateEventInput {
  id: string;
  changes: Partial<EventDetails>;
}

@Injectable()
export class UpdateEventUseCase implements UseCase<UpdateEventInput, MallEvent> {
  constructor(private readonly events: MallEventRepository) {}

  async execute({ id, changes }: UpdateEventInput): Promise<MallEvent> {
    const event = await this.events.findById(id);
    if (!event) {
      throw new NotFoundError(`Event ${id} not found`);
    }

    const { startDate, endDate, ...rest } = omitUndefined(changes);
    const periodChanged = startDate !== undefined || endDate !== undefined;
    const current = event.props.period;

    event.update({
      ...rest,
      ...(periodChanged && {
        period: EventPeriod.create(
          startDate ?? current.startDate,
          endDate ?? current.endDate,
        ),
      }),
    });
    await this.events.save(event);
    return event;
  }
}
