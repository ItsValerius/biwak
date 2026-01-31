export const ADMIN_SESSION_COOKIE = "biwak_admin_session";

export const EVENT_STATUS = {
  RUNNING: "running",
  PAUSE_UMBAU: "pause_umbau",
} as const;

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
} as const;

export const ERROR_MESSAGE = {
  UNAUTHORIZED: "Unauthorized",
  NO_EVENT: "No event found",
  EVENT_NOT_FOUND: "Event not found",
  SLOT_NOT_FOUND: "Slot not found",
  SLOTS_SAME_EVENT: "Slots must belong to the same event",
  PASSWORD_REQUIRED: "password required",
  INVALID_PASSWORD: "Invalid password",
  NAME_AND_LOCATION_REQUIRED: "Name and location are required",
  INVALID_EVENT_DATA: "Invalid event data",
  INVALID_SLOT_DATA: "Invalid slot data",
  AT_LEAST_ONE_SLOT: "Add at least one schedule slot",
} as const;
