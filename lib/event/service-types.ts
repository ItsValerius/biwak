/**
 * Types used by the event service layer (server-side).
 * For client types, see "@/lib/event/types".
 */
import type { ScheduleSlot } from "@/lib/db/schema";
import { events } from "@/lib/db/schema";

export type SerializedSlot = Omit<ScheduleSlot, "plannedStart" | "actualStart"> & {
  plannedStart: string;
  actualStart: string | null;
};

export type EventWithSlots = {
  event: typeof events.$inferSelect;
  slots: SerializedSlot[];
};
