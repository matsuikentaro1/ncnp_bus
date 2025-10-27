import HolidayJp from "@holiday-jp/holiday_jp";

/**
 * Checks if the given date is a Japanese national holiday
 * @param date - The date to check (in any timezone)
 * @returns true if the date is a holiday, false otherwise
 */
export function isJapanHoliday(date: Date): boolean {
  // Format date as YYYY-MM-DD in local time (Asia/Tokyo)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  // Check if the date is a holiday
  const holiday = HolidayJp.isHoliday(new Date(dateString));
  return holiday;
}

/**
 * Checks if the given date is a service day (weekday and not a holiday)
 * @param date - The date to check (must be in Asia/Tokyo timezone)
 * @returns true if service operates, false otherwise
 */
export function isServiceDay(date: Date): boolean {
  const dayOfWeek = date.getDay();

  // Check if weekend (Saturday = 6, Sunday = 0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  // Check if it's a national holiday
  if (isJapanHoliday(date)) {
    return false;
  }

  return true;
}
