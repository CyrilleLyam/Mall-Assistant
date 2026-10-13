import { Entity } from '../../../shared/domain/entity.js';
import { newId } from '../../../shared/domain/id.js';
import { ValidationError } from '../../../shared/domain/domain.error.js';
import { EventPeriod } from './event-period.js';

export interface MallEventProps {
  titleEn: string;
  titleKm: string;
  descriptionEn: string;
  descriptionKm: string;
  period: EventPeriod;
}

export class MallEvent extends Entity {
  private constructor(
    id: string,
    private current: MallEventProps,
  ) {
    super(id);
  }

  static create(props: MallEventProps): MallEvent {
    MallEvent.assertValid(props);
    return new MallEvent(newId(), props);
  }

  static restore(id: string, props: MallEventProps): MallEvent {
    return new MallEvent(id, props);
  }

  get props(): Readonly<MallEventProps> {
    return this.current;
  }

  update(changes: Partial<MallEventProps>): void {
    const next = { ...this.current, ...changes };
    MallEvent.assertValid(next);
    this.current = next;
  }

  private static assertValid(props: MallEventProps): void {
    if (!props.titleEn.trim() || !props.titleKm.trim()) {
      throw new ValidationError('Event titles (English and Khmer) are required');
    }
  }
}
