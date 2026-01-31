import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  location: text("location").notNull(),
  status: text("status", {
    enum: ["running", "pause_umbau"],
  })
    .notNull()
    .default("running"),
  currentSlotId: text("current_slot_id"),
});

export const scheduleSlots = sqliteTable("schedule_slots", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  clubName: text("club_name").notNull(),
  plannedStart: integer("planned_start", { mode: "timestamp_ms" }).notNull(),
  orderIndex: integer("order_index").notNull(),
  actualStart: integer("actual_start", { mode: "timestamp_ms" }),
});

export const appConfig = sqliteTable("app_config", {
  key: text("key").primaryKey(),
  value: text("value"),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type ScheduleSlot = typeof scheduleSlots.$inferSelect;
export type NewScheduleSlot = typeof scheduleSlots.$inferInsert;
