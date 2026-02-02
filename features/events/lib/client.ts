/**
 * Client-safe event helpers and types. Use this in "use client" components.
 * Does not import service or db (no libsql).
 */
export {
  getCurrentSlot,
  getNextSlots,
  getMinutesPastPlanned,
  getMinutesSlotStartedLate,
  getMinutesSlotDeviation,
  getScheduleDeviationBadge,
  type ScheduleDeviationBadge,
} from "./schedule";
export {
  formatTime,
  formatDateTimeLocalBerlin,
  parseBerlinDateTimeLocalToIso,
  formatDateLocalBerlin,
  GERMAN_TIMEZONE,
} from "./date-utils";
export type { Slot, Event, EventWithSlots } from "./types";
export type { GetEventResponse } from "@/lib/api";
