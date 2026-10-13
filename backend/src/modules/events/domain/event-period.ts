import { ValidationError } from '../../../shared/domain/domain.error.js';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type EventStatus = 'current' | 'upcoming' | 'past';

const isRealDate = (value: string): boolean => {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
};

export class EventPeriod {
  private constructor(
    readonly startDate: string,
    readonly endDate: string,
  ) {}

  static create(startDate: string, endDate: string): EventPeriod {
    if (!isRealDate(startDate) || !isRealDate(endDate)) {
      throw new ValidationError('Event dates must be valid YYYY-MM-DD dates');
    }
    if (endDate < startDate) {
      throw new ValidationError('Event end date must not be before the start date');
    }
    return new EventPeriod(startDate, endDate);
  }

  statusOn(today: string): EventStatus {
    if (today < this.startDate) {
      return 'upcoming';
    }
    if (today > this.endDate) {
      return 'past';
    }
    return 'current';
  }
}
