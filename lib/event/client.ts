/**
 * Client-safe event helpers and types. Use this in "use client" components.
 * Does not import service or db (no libsql).
 */
export {
  getCurrentSlot,
  getNextSlots,
  getMinutesPastPlanned,
  getMinutesSlotStartedLate,
  formatTime,
  formatDateTimeLocalBerlin,
  parseBerlinDateTimeLocalToIso,
  formatDateLocalBerlin,
  GERMAN_TIMEZONE,
  type Slot,
  type Event,
} from "./utils";
export type { EventWithSlots } from "./types";
export type { GetEventResponse } from "@/lib/api";
