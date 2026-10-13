export function lastDays(today: string, count: number): string[] {
  const [year, month, day] = today.split('-').map(Number);
  return Array.from({ length: count }, (_, index) =>
    new Date(Date.UTC(year, month - 1, day - (count - 1 - index)))
      .toISOString()
      .slice(0, 10),
  );
}
