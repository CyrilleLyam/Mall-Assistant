import { MallEvent } from '../../../domain/mall-event.entity.js';
import { EventStatus } from '../../../domain/event-period.js';

export class EventResponse {
  id: string;
  titleEn: string;
  titleKm: string;
  descriptionEn: string;
  descriptionKm: string;
  startDate: string;
  endDate: string;
  status: EventStatus;

  static from(event: MallEvent, today: string): EventResponse {
    const { period, ...rest } = event.props;
    return {
      id: event.id,
      ...rest,
      startDate: period.startDate,
      endDate: period.endDate,
      status: period.statusOn(today),
    };
  }
}
