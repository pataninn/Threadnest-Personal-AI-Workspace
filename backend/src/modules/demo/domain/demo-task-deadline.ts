const DAY_MS = 86_400_000;
const demoCalendar = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
});

/** Preserves the published calendar-day offset using the demo's immutable start. */
export function demoTaskDeadline(deadline: string | null, publishedAt: string, sessionCreatedAt: Date | string): string | null {
  if (deadline === null) return null;
  const original = Date.parse(`${deadline}T00:00:00.000Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(deadline) || !Number.isFinite(original)
    || new Date(original).toISOString().slice(0, 10) !== deadline) throw new RangeError('The demo deadline is invalid.');
  const publishedDay = Date.parse(`${demoCalendar.format(new Date(publishedAt))}T00:00:00.000Z`);
  const sessionDay = Date.parse(`${demoCalendar.format(new Date(sessionCreatedAt))}T00:00:00.000Z`);
  const shifted = new Date(original + Math.round((sessionDay - publishedDay) / DAY_MS) * DAY_MS).toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(shifted)) throw new RangeError('The shifted demo deadline is outside the supported range.');
  return shifted;
}
