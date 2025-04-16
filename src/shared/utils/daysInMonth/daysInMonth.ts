export function daysInMonth(date: Date): Record<string, Date> {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const numOfDays = new Date(year, month, 0).getDate();

  const days: Record<string, Date> = {};

  for (let i = 1; i <= numOfDays; i++) {
    const t = new Date(year, month - 1, i);
    const weekOfMonth = getWeekOfMonth(t);
    const dayOfWeek = t.getDay();
    console.log(dayOfWeek);
    days[`${weekOfMonth}-${dayOfWeek}`] = t;
  }

  return days;
}

function getWeekOfMonth(date: Date): number {
  let firstWeekday =
    new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
  if (firstWeekday < 0) firstWeekday = 6;
  const offsetDate = date.getDate() + firstWeekday - 1;
  return Math.floor(offsetDate / 7);
}
