/**
 * Read-only event queries.
 * For mutations, see events.ts and slots.ts.
 */
import { db } from "@/lib/db";
import { events, scheduleSlots, appConfig } from "@/lib/db/schema";
import type { ScheduleSlot } from "@/lib/db/schema";
import {
  eventSelectSchema,
  scheduleSlotSelectSchema,
} from "@/lib/db/schemas-zod";
import { eq, asc } from "drizzle-orm";
import type { SerializedSlot, EventWithSlots } from "./service-types";

export type { SerializedSlot, EventWithSlots } from "./service-types";

export async function getActiveEventId(): Promise<string | null> {
  const row = await db.query.appConfig.findFirst({
    where: eq(appConfig.key, "active_event_id"),
    columns: { value: true },
  });
  return row?.value ?? null;
}

export async function getEventWithSlots(
  eventId: string | null | undefined
): Promise<EventWithSlots | null> {
  const resolvedEventId = eventId ?? (await getActiveEventId());
  if (!resolvedEventId) return null;

  const event = await db.query.events.findFirst({
    where: eq(events.id, resolvedEventId),
  });
  if (!event) return null;

  const eventRow = eventSelectSchema.parse(event);

  const slots = await db.query.scheduleSlots.findMany({
    where: eq(scheduleSlots.eventId, event.id),
    orderBy: asc(scheduleSlots.orderIndex),
  });
  const validatedSlots = slots.map((slot) =>
    scheduleSlotSelectSchema.parse(slot)
  );

  return {
    event: eventRow,
    slots: validatedSlots.map(serializeSlotForApi),
  };
}

export async function listEvents(): Promise<
  { id: string; name: string; location: string }[]
> {
  const rows = await db.query.events.findMany({
    columns: { id: true, name: true, location: true },
    orderBy: asc(events.name),
  });
  return eventSelectSchema
    .pick({ id: true, name: true, location: true })
    .array()
    .parse(rows);
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
