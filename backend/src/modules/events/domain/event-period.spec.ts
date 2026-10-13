import { ValidationError } from '../../../shared/domain/domain.error.js';
import { EventPeriod } from './event-period.js';

describe('EventPeriod', () => {
  const period = EventPeriod.create('2026-10-10', '2026-10-20');

  it('is upcoming before the start date', () => {
    expect(period.statusOn('2026-10-09')).toBe('upcoming');
  });

  it('is current on the first and last day', () => {
    expect(period.statusOn('2026-10-10')).toBe('current');
    expect(period.statusOn('2026-10-20')).toBe('current');
  });

  it('is past after the end date', () => {
    expect(period.statusOn('2026-10-21')).toBe('past');
  });

  it('rejects an end date before the start date', () => {
    expect(() => EventPeriod.create('2026-10-20', '2026-10-10')).toThrow(
      ValidationError,
    );
  });

  it('rejects dates that do not exist', () => {
    expect(() => EventPeriod.create('2026-02-31', '2026-03-05')).toThrow(
      ValidationError,
    );
    expect(() => EventPeriod.create('10/10/2026', '2026-10-20')).toThrow(
      ValidationError,
    );
  });
});
