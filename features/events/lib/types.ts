/**
 * Shared event domain types. Used by both server (service) and client (API response).
 * For client components, import from "@/features/events/lib/client" which re-exports these.
 */

export type Slot = {
  id: string;
  eventId: string;
  clubName: string;
  plannedStart: string;
  orderIndex: number;
  actualStart: string | null;
};

export type Event = {
  id: string;
  name: string;
  location: string;
  status: "running" | "pause_umbau";
  currentSlotId: string | null;
};

/** Event with slots - matches GET /api/event response shape. */
export type EventWithSlots = {
  event: Event;
  slots: Slot[];
};
