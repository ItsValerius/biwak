/**
 * Event domain: server-side service (DB operations) and utilities.
 * For client components, use "@/features/events/lib/client" instead.
 */
export {
  getActiveEventId,
  getEventWithSlots,
  listEvents,
  type EventWithSlots,
} from "./queries";
export {
  setCurrentSlot,
  swapSlots,
  deleteSlot,
  togglePause,
  createEvent,
  createSlots,
  updateSlot,
  updateEvent,
  setActiveEvent,
  unsetActiveEvent,
  deleteEvent,
  resetSlotsActualStart,
  resetSlotActualStart,
} from "./mutations";
export {
  getCurrentSlot,
  getNextSlots,
  getMinutesPastPlanned,
} from "./schedule";
export { formatTime, formatDateLocalBerlin } from "./date-utils";
export type { Slot, Event } from "./types";
