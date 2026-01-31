import { formatInTimeZone, toDate } from "date-fns-tz";
import type { Slot } from "./types";

export type { Slot, Event } from "./types";

/** Timezone for local German time (CET/CEST). */
export const GERMAN_TIMEZONE = "Europe/Berlin";

export function getCurrentSlot(slots: Slot[], currentSlotId: string | null): Slot | null {
  if (!currentSlotId) return null;
  return slots.find((s) => s.id === currentSlotId) ?? null;
}

export function getNextSlots(slots: Slot[], currentSlotId: string | null, count = 2): Slot[] {
  const idx = currentSlotId
    ? slots.findIndex((s) => s.id === currentSlotId)
    : -1;
  const start = idx < 0 ? 0 : idx + 1;
  return slots.slice(start, start + count);
}

/** Minutes past a planned start time (positive = late). */
export function getMinutesPastPlanned(plannedStartIso: string, now: Date): number {
  const planned = new Date(plannedStartIso).getTime();
  return Math.round((now.getTime() - planned) / 60_000);
}

/** Minutes the slot was started late (0 if on time or no actualStart). */
export function getMinutesSlotStartedLate(slot: Slot | null): number {
  if (!slot?.actualStart) return 0;
  const minutes = getMinutesPastPlanned(slot.plannedStart, new Date(slot.actualStart));
  return Math.max(0, minutes);
}

/** Minutes deviation: positive = started late, negative = started early, 0 if no actualStart. */
export function getMinutesSlotDeviation(slot: Slot | null): number {
  if (!slot?.actualStart) return 0;
  return getMinutesPastPlanned(slot.plannedStart, new Date(slot.actualStart));
}

export type ScheduleDeviationBadge =
  | { label: string; variant: "behind" }
  | { label: string; variant: "ahead" };

/**
 * Computes the schedule deviation badge for the "Up Next" section.
 * - behind: slot started late or next slot's planned start is in the past
 * - ahead: slot started early or next slot's planned start is in the future
 */
export function getScheduleDeviationBadge(
  currentSlot: Slot | null,
  nextSlot: Slot | null,
  now: Date
): ScheduleDeviationBadge | null {
  const minutes = [
    nextSlot ? getMinutesPastPlanned(nextSlot.plannedStart, now) : null,
    getMinutesSlotDeviation(currentSlot),
  ].filter((v): v is number => v !== null);

  const behind = Math.max(0, ...minutes.filter((m) => m > 0));
  const ahead = Math.min(0, ...minutes.filter((m) => m < 0));

  if (behind > 0) return { label: `+${behind} Min.`, variant: "behind" };
  if (ahead < 0) return { label: `${ahead} Min.`, variant: "ahead" };
  return null;
}

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
