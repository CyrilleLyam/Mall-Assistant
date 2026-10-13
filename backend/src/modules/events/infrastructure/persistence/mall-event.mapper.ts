import { EventPeriod } from '../../domain/event-period.js';
import { MallEvent } from '../../domain/mall-event.entity.js';
import { MallEventOrmEntity } from './mall-event.orm-entity.js';

export const MallEventMapper = {
  toDomain(row: MallEventOrmEntity): MallEvent {
    return MallEvent.restore(row.id, {
      titleEn: row.titleEn,
      titleKm: row.titleKm,
      descriptionEn: row.descriptionEn,
      descriptionKm: row.descriptionKm,
      period: EventPeriod.create(row.startDate, row.endDate),
    });
  },

  toPersistence(event: MallEvent): MallEventOrmEntity {
    const { period, ...rest } = event.props;
    return Object.assign(new MallEventOrmEntity(), {
      id: event.id,
      ...rest,
      startDate: period.startDate,
      endDate: period.endDate,
    });
  },
};
