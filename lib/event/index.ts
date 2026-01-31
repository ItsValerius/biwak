/**
 * Event domain: server-side service (DB operations) and utilities.
 * For client components, use "@/lib/event/client" instead.
 */
export {
  getEventWithSlots,
  listEvents,
  getActiveEventId,
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
  type EventWithSlots,
  type SerializedSlot,
} from "./service";
export {
  getCurrentSlot,
  getNextSlots,
  getMinutesPastPlanned,
  formatTime,
  type Slot,
  type Event,
} from "./utils";
