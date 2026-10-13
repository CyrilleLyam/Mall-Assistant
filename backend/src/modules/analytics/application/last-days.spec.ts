import { lastDays } from './last-days.js';

describe('lastDays', () => {
  it('lists the days ending today, oldest first', () => {
    expect(lastDays('2026-10-13', 3)).toEqual(['2026-10-11', '2026-10-12', '2026-10-13']);
  });

  it('crosses month and year boundaries', () => {
    expect(lastDays('2026-03-02', 4)).toEqual([
      '2026-02-27',
      '2026-02-28',
      '2026-03-01',
      '2026-03-02',
    ]);
    expect(lastDays('2027-01-01', 2)).toEqual(['2026-12-31', '2027-01-01']);
  });

  it('returns just today for a single day', () => {
    expect(lastDays('2026-10-13', 1)).toEqual(['2026-10-13']);
  });
});
