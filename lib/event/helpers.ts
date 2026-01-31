/**
 * Shared helpers for event/slot DB operations.
 * Used by events.ts and slots.ts.
 */
import { db } from "@/lib/db";
import { events, scheduleSlots } from "@/lib/db/schema";
import { eq, desc, lt, and, isNotNull } from "drizzle-orm";
import type { ScheduleSlot } from "@/lib/db/schema";

export async function findEventById(eventId: string) {
  return db.query.events.findFirst({
    where: eq(events.id, eventId),
  });
}

export async function findSlotById(slotId: string): Promise<ScheduleSlot | null> {
  const slot = await db.query.scheduleSlots.findFirst({
    where: eq(scheduleSlots.id, slotId),
  });
  return slot ?? null;
}

/**
 * Find the previous slot (by orderIndex) that has actualStart set.
 * Used when resetting the current slot's actualStart - we set currentSlotId
 * to the previous started slot.
 */
export async function findPreviousSlotWithActualStart(
  eventId: string,
  beforeOrderIndex: number
): Promise<ScheduleSlot | null> {
  const slot = await db.query.scheduleSlots.findFirst({
    where: and(
      eq(scheduleSlots.eventId, eventId),
      lt(scheduleSlots.orderIndex, beforeOrderIndex),
      isNotNull(scheduleSlots.actualStart),
    ),
    orderBy: desc(scheduleSlots.orderIndex),
  });
  return slot ?? null;
}