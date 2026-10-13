import { ValidationError } from '../../../shared/domain/domain.error.js';
import { OpeningHours } from './opening-hours.js';

describe('OpeningHours', () => {
  const hours = OpeningHours.create('10:00', '21:30');

  it('is open between opening and closing time', () => {
    expect(hours.isOpenAt('10:00')).toBe(true);
    expect(hours.isOpenAt('15:45')).toBe(true);
  });

  it('is closed before opening and from closing time on', () => {
    expect(hours.isOpenAt('09:59')).toBe(false);
    expect(hours.isOpenAt('21:30')).toBe(false);
  });

  it('rejects malformed times', () => {
    expect(() => OpeningHours.create('9:00', '21:00')).toThrow(ValidationError);
    expect(() => OpeningHours.create('10:00', '25:00')).toThrow(ValidationError);
  });

  it('rejects closing time that is not after opening time', () => {
    expect(() => OpeningHours.create('18:00', '10:00')).toThrow(ValidationError);
    expect(() => OpeningHours.create('10:00', '10:00')).toThrow(ValidationError);
  });
});
