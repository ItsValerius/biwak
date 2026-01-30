import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { events, scheduleSlots } from "./schema";

/**
 * Zod schemas generated from Drizzle tables – single source of truth for DB row shapes.
 * Use select schemas to validate data from the DB (e.g. before returning from API).
 * Use insert schemas to validate data before inserting (e.g. future create-event/slot endpoints).
 */

/** Validates a row from the events table */
export const eventSelectSchema = createSelectSchema(events);

/** Validates data for inserting into events */
export const eventInsertSchema = createInsertSchema(events);

/** Validates a row from the schedule_slots table */
export const scheduleSlotSelectSchema = createSelectSchema(scheduleSlots);

/** Validates data for inserting into schedule_slots */
export const scheduleSlotInsertSchema = createInsertSchema(scheduleSlots);
