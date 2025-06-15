export function getDayName(day: number): string {
  const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
  return days[day - 1] ?? `День ${day}`;
}
