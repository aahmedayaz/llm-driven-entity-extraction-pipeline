export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 5 || hour >= 17) {
    return "Good Evening";
  }
  if (hour < 12) {
    return "Good Morning";
  }
  if (hour < 17) {
    return "Good Afternoon";
  }
  return "Good Evening";
}

export function getTeamGreeting(): string {
  return `${getTimeOfDayGreeting()}, Team Ralico`;
}
