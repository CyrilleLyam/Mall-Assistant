import { ValidationError } from '../../../shared/domain/domain.error.js';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export class OpeningHours {
  private constructor(
    readonly open: string,
    readonly close: string,
  ) {}

  static create(open: string, close: string): OpeningHours {
    if (!TIME_PATTERN.test(open) || !TIME_PATTERN.test(close)) {
      throw new ValidationError('Opening hours must use the HH:mm format');
    }
    if (open >= close) {
      throw new ValidationError('Closing time must be after opening time');
    }
    return new OpeningHours(open, close);
  }

  isOpenAt(time: string): boolean {
    return time >= this.open && time < this.close;
  }
}
