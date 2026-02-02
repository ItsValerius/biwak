import { formatInTimeZone, toDate } from "date-fns-tz";

/** Timezone for local German time (CET/CEST). */
export const GERMAN_TIMEZONE = "Europe/Berlin";

/** Format ISO time string as local German time (e.g. "14:30"). */
export function formatTime(iso: string): string {
  return formatInTimeZone(new Date(iso), GERMAN_TIMEZONE, "HH:mm");
}

/** Format ISO date-time as "YYYY-MM-DDTHH:mm" in German local time (for datetime-local inputs). */
export function formatDateTimeLocalBerlin(iso: string): string {
  return formatInTimeZone(new Date(iso), GERMAN_TIMEZONE, "yyyy-MM-dd'T'HH:mm");
}

/** Parse "YYYY-MM-DDTHH:mm" or "YYYY-MM-DDTHH:mm:ss" as German local time and return ISO string. */
export function parseBerlinDateTimeLocalToIso(dateTimeLocalStr: string): string {
  const d = toDate(dateTimeLocalStr, { timeZone: GERMAN_TIMEZONE });
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

/** Format a date as "YYYY-MM-DD" in German local time (e.g. for date inputs or CSV base date). */
export function formatDateLocalBerlin(date: Date = new Date()): string {
  return formatInTimeZone(date, GERMAN_TIMEZONE, "yyyy-MM-dd");
}
