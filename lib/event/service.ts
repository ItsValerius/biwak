import { db } from "@/lib/db";
import { events, scheduleSlots } from "@/lib/db/schema";
import type { ScheduleSlot } from "@/lib/db/schema";
import {
  eventSelectSchema,
  scheduleSlotSelectSchema,
} from "@/lib/db/schemas-zod";
import { eq, asc } from "drizzle-orm";

export type SerializedSlot = Omit<ScheduleSlot, "plannedStart" | "actualStart"> & {
  plannedStart: string;
  actualStart: string | null;
};

export type EventWithSlots = {
  event: typeof events.$inferSelect;
  slots: SerializedSlot[];
};

export async function getEventWithSlots(
  eventId: string | null | undefined
): Promise<EventWithSlots | null> {
  const resolvedEventId = eventId ?? (await getFirstEventId());
  if (!resolvedEventId) return null;

  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, resolvedEventId))
    .limit(1);

  if (!event) {
    return null;
  }

  const eventRow = eventSelectSchema.parse(event);

  const slots = await db
    .select()
    .from(scheduleSlots)
    .where(eq(scheduleSlots.eventId, event.id))
    .orderBy(asc(scheduleSlots.orderIndex));

  const validatedSlots = slots.map((slot) => scheduleSlotSelectSchema.parse(slot));

  return {
    event: eventRow,
    slots: validatedSlots.map(serializeSlotForApi),
  };
}

export async function listEvents(): Promise<
  { id: string; name: string; location: string }[]
> {
  const rows = await db
    .select({ id: events.id, name: events.name, location: events.location })
    .from(events)
    .orderBy(asc(events.name));
  return eventSelectSchema
    .pick({ id: true, name: true, location: true })
    .array()
    .parse(rows);
}

async function getFirstEventId(): Promise<string | null> {
  const [first] = await db.select({ id: events.id }).from(events).limit(1);
  return first?.id ?? null;
}

function serializeSlotForApi(slot: ScheduleSlot): SerializedSlot {
  return {
    id: slot.id,
    eventId: slot.eventId,
    clubName: slot.clubName,
    orderIndex: slot.orderIndex,
    plannedStart: slot.plannedStart?.toISOString() ?? "",
    actualStart: slot.actualStart?.toISOString() ?? null,
  };
}
