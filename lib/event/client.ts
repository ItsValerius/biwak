/**
 * Client-safe event helpers and types. Use this in "use client" components.
 * Does not import service or db (no libsql).
 */
export {
  getCurrentSlot,
  getNextSlots,
  getMinutesPastPlanned,
  formatTime,
  type Slot,
  type Event,
} from "./utils";

export type { GetEventResponse, GetEventResponse as EventWithSlots } from "@/lib/api";
