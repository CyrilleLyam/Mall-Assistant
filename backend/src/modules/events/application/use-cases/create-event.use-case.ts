import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.js';
import { EventPeriod } from '../../domain/event-period.js';
import { MallEvent } from '../../domain/mall-event.entity.js';
import { MallEventRepository } from '../../domain/mall-event.repository.js';
import { EventDetails } from '../event-details.js';

@Injectable()
export class CreateEventUseCase implements UseCase<EventDetails, MallEvent> {
  constructor(private readonly events: MallEventRepository) {}

  async execute(input: EventDetails): Promise<MallEvent> {
    const event = MallEvent.create({
      titleEn: input.titleEn,
      titleKm: input.titleKm,
      descriptionEn: input.descriptionEn ?? '',
      descriptionKm: input.descriptionKm ?? '',
      period: EventPeriod.create(input.startDate, input.endDate),
    });
    await this.events.save(event);
    return event;
  }
}
