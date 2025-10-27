import scheduleData from "../data/schedule.json";

export type StopName = "萩山駅" | "新小平駅" | "NCNP病院";

export type Route = {
  origin: StopName;
  destination: StopName;
  hours: Record<string, number[]>;
};

export type Schedule = {
  timezone: string;
  holidaysProvider: string;
  routes: Route[];
};

/**
 * Gets all routes from the schedule data
 */
export function getSchedule(): Schedule {
  return scheduleData as Schedule;
}

/**
 * Gets all routes that depart from the specified origin
 * @param origin - The departure stop name
 * @returns Array of routes (can be multiple for NCNP病院)
 */
export function getRoutesByOrigin(origin: StopName): Route[] {
  const schedule = getSchedule();
  return schedule.routes.filter(route => route.origin === origin);
}

/**
 * Gets all unique origin stop names from the schedule
 */
export function getAllOrigins(): StopName[] {
  const schedule = getSchedule();
  const origins = new Set<StopName>();
  schedule.routes.forEach(route => origins.add(route.origin));
  return Array.from(origins);
}
