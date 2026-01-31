/**
 * Event domain: server-side service (DB operations).
 * Re-exports from queries, events, slots. For client components, use "@/lib/event/client".
 */
export {
  getActiveEventId,
  getEventWithSlots,
  listEvents,
  type SerializedSlot,
  type EventWithSlots,
} from "./queries";
export {
  createEvent,
  updateEvent,
  deleteEvent,
  setActiveEvent,
  unsetActiveEvent,
  togglePause,
} from "./events";
export {
  setCurrentSlot,
  swapSlots,
  deleteSlot,
  updateSlot,
  createSlots,
  resetSlotsActualStart,
  resetSlotActualStart,
} from "./slots";
