import type { StopName, Route } from "./schedule";
import { getRoutesByOrigin } from "./schedule";

export type DepartureItem = {
  origin: StopName;
  destination: StopName;
  departureTime: Date;
  label: string;
  remainingMs: number;
};

/**
 * Creates a Date object for a specific hour and minute on the same day as baseDate
 * All dates are handled in local time (Asia/Tokyo)
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @param baseDate - Reference date to use for year/month/day
 * @returns Date object with specified time
 */
export function toZonedDate(hour: number, minute: number, baseDate: Date): Date {
  const result = new Date(baseDate);
  result.setHours(hour, minute, 0, 0);
  return result;
}

/**
 * Formats a Date to HH:mm format
 * @param date - Date to format
 * @returns Time string in HH:mm format
 */
export function formatHm(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Formats remaining milliseconds to mm:ss format
 * @param remainingMs - Remaining time in milliseconds
 * @returns Time string in mm:ss format
 */
export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Converts a route's timetable into an array of DepartureItems
 * @param route - Route with hours/minutes data
 * @param baseDate - Reference date (today)
 * @param now - Current time
 * @returns Array of departure items with remaining time
 */
function routeToDepartures(route: Route, baseDate: Date, now: Date): DepartureItem[] {
  const departures: DepartureItem[] = [];

  for (const [hourStr, minutes] of Object.entries(route.hours)) {
    const hour = parseInt(hourStr, 10);

    for (const minute of minutes) {
      const departureTime = toZonedDate(hour, minute, baseDate);
      const remainingMs = departureTime.getTime() - now.getTime();

      departures.push({
        origin: route.origin,
        destination: route.destination,
        departureTime,
        label: `${route.destination}行き`,
        remainingMs,
      });
    }
  }

  return departures;
}

/**
 * Gets the first departures of the day for display before 8:00 AM
 * @param origin - Departure stop
 * @param now - Current time
 * @returns Array of first departure items (may be multiple for NCNP病院)
 */
export function getFirstDeparturesToday(origin: StopName, now: Date): DepartureItem[] {
  const routes = getRoutesByOrigin(origin);
  const allDepartures: DepartureItem[] = [];

  for (const route of routes) {
    const departures = routeToDepartures(route, now, now);

    // Find the earliest departure for this route
    if (departures.length > 0) {
      const earliest = departures.reduce((prev, curr) =>
        curr.departureTime < prev.departureTime ? curr : prev
      );
      allDepartures.push(earliest);
    }
  }

  // Sort by departure time
  allDepartures.sort((a, b) => a.departureTime.getTime() - b.departureTime.getTime());

  return allDepartures;
}

/**
 * Gets the next N departures from the specified origin
 * @param origin - Departure stop
 * @param now - Current time
 * @param take - Number of departures to return (default: 2)
 * @returns Array of next departure items, sorted by time
 */
export function getNextDepartures(origin: StopName, now: Date, take: number = 2): DepartureItem[] {
  const routes = getRoutesByOrigin(origin);
  const allDepartures: DepartureItem[] = [];

  // Collect all departures from all routes for this origin
  for (const route of routes) {
    const departures = routeToDepartures(route, now, now);

    // Filter to only future departures (with a small grace period)
    const futureDepartures = departures.filter(d => d.remainingMs > -2000);
    allDepartures.push(...futureDepartures);
  }

  // Sort by remaining time (ascending)
  allDepartures.sort((a, b) => a.remainingMs - b.remainingMs);

  // Return the first N items
  return allDepartures.slice(0, take);
}

/**
 * Formats a date to Japanese date format with day of week
 * @param date - Date to format
 * @returns Formatted string like "2025/10/27(月)"
 */
export function formatDateJa(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

  return `${year}/${month}/${day}(${dayOfWeek})`;
}
