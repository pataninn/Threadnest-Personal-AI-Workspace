import { demoTaskDeadline } from '@/modules/demo/domain/demo-task-deadline';

describe('demoTaskDeadline', () => {
  const published = '2026-10-28T03:11:00.000Z';
  const started = '2026-11-07T08:00:00.000Z';

  it.each([
    ['2026-10-26', '2026-11-05'],
    ['2026-10-28', '2026-11-07'],
    ['2026-10-31', '2026-11-10'],
    ['2026-11-02', '2026-11-12'],
    ['2026-11-05', '2026-11-15']
  ])('preserves the published offset from %s as %s', (deadline, expected) => {
    expect(demoTaskDeadline(deadline, published, started)).toBe(expected);
  });

  it('preserves tasks without deadlines', () => {
    expect(demoTaskDeadline(null, published, started)).toBeNull();
  });

  it('uses the Shanghai calendar day across a UTC midnight boundary', () => {
    expect(demoTaskDeadline('2026-10-29', '2026-10-28T15:59:59Z', '2026-11-06T16:00:00Z')).toBe('2026-11-08');
  });

  it.each([
    ['2024-02-28', '2024-02-29', '2024-03-01'],
    ['2026-12-31', '2027-01-01', '2027-01-02']
  ])('preserves calendar spacing across month and year boundaries', (publicationDay, deadline, expected) => {
    const startDay = publicationDay === '2024-02-28' ? '2024-02-29' : '2027-01-01';
    expect(demoTaskDeadline(deadline, `${publicationDay}T00:00:00Z`, new Date(`${startDay}T00:00:00Z`))).toBe(expected);
  });

  it('uses the persisted start rather than the current clock during a retry', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-08T05:00:00Z'));
    try { expect(demoTaskDeadline('2026-10-31', published, started)).toBe('2026-11-10'); }
    finally { jest.useRealTimers(); }
  });

  it.each(['2026-02-30', '2026-13-01', '2026-1-01', 'invalid'])('rejects invalid deadline %s', (deadline) => {
    expect(() => demoTaskDeadline(deadline, published, started)).toThrow(RangeError);
  });
});
