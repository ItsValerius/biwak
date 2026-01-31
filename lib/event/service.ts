import { db } from "@/lib/db";
import { events, scheduleSlots, appConfig } from "@/lib/db/schema";
import type { ScheduleSlot } from "@/lib/db/schema";
import {
  eventSelectSchema,
  scheduleSlotSelectSchema,
} from "@/lib/db/schemas-zod";
import { eq, asc, desc } from "drizzle-orm";
import { ERROR_MESSAGE, EVENT_STATUS } from "@/lib/constants";

export type SerializedSlot = Omit<ScheduleSlot, "plannedStart" | "actualStart"> & {
  plannedStart: string;
  actualStart: string | null;
};

export type EventWithSlots = {
  event: typeof events.$inferSelect;
  slots: SerializedSlot[];
};

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

  if (!event) {
    return null;
  }

  const eventRow = eventSelectSchema.parse(event);

  const slots = await db.query.scheduleSlots.findMany({
    where: eq(scheduleSlots.eventId, event.id),
    orderBy: asc(scheduleSlots.orderIndex),
  });

  const validatedSlots = slots.map((slot) => scheduleSlotSelectSchema.parse(slot));

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

export async function setCurrentSlot(slotId: string): Promise<{ error?: string }> {
  const slot = await db.query.scheduleSlots.findFirst({
    where: eq(scheduleSlots.id, slotId),
  });
  if (!slot) return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };

  const now = new Date();
  await db.update(events).set({ currentSlotId: slotId }).where(eq(events.id, slot.eventId));
  if (!slot.actualStart) {
    await db.update(scheduleSlots).set({ actualStart: now }).where(eq(scheduleSlots.id, slotId));
  }
  return {};
}

export async function swapSlots(slotIdA: string, slotIdB: string): Promise<{ error?: string }> {
  const [slotA, slotB] = await Promise.all([
    db.query.scheduleSlots.findFirst({ where: eq(scheduleSlots.id, slotIdA) }),
    db.query.scheduleSlots.findFirst({ where: eq(scheduleSlots.id, slotIdB) }),
  ]);
  if (!slotA || !slotB) return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };
  if (slotA.eventId !== slotB.eventId) return { error: ERROR_MESSAGE.SLOTS_SAME_EVENT };

  await db
    .update(scheduleSlots)
    .set({ orderIndex: slotB.orderIndex, plannedStart: slotB.plannedStart, actualStart: slotB.actualStart })
    .where(eq(scheduleSlots.id, slotIdA));
  await db
    .update(scheduleSlots)
    .set({ orderIndex: slotA.orderIndex, plannedStart: slotA.plannedStart, actualStart: slotA.actualStart })
    .where(eq(scheduleSlots.id, slotIdB));
  return {};
}

export async function deleteSlot(slotId: string): Promise<{ error?: string }> {
  const slot = await db.query.scheduleSlots.findFirst({
    where: eq(scheduleSlots.id, slotId),
  });
  if (!slot) return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };

  const event = await db.query.events.findFirst({
    where: eq(events.id, slot.eventId),
    columns: { currentSlotId: true },
  });
  if (event?.currentSlotId === slotId) {
    await db.update(events).set({ currentSlotId: null }).where(eq(events.id, slot.eventId));
  }
  await db.delete(scheduleSlots).where(eq(scheduleSlots.id, slotId));
  return {};
}

export async function togglePause(eventId?: string): Promise<{ error?: string }> {
  const resolvedEventId = eventId ?? (await getActiveEventId()) ?? null;
  const event = resolvedEventId
    ? await db.query.events.findFirst({ where: eq(events.id, resolvedEventId) })
    : await db.query.events.findFirst();
  if (!event) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };

  const newStatus = event.status === EVENT_STATUS.RUNNING ? EVENT_STATUS.PAUSE_UMBAU : EVENT_STATUS.RUNNING;
  await db.update(events).set({ status: newStatus }).where(eq(events.id, event.id));
  return {};
}

export async function createEvent(data: {
  name: string;
  location: string;
}): Promise<{ error?: string; id?: string }> {
  const [newEvent] = await db
    .insert(events)
    .values({
      name: data.name.trim(),
      location: data.location.trim(),
      status: EVENT_STATUS.RUNNING,
    })
    .returning();
  if (!newEvent) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };
  return { id: newEvent.id };
}

export async function createSlots(
  eventId: string,
  slots: Array<{ clubName: string; plannedStart: string }>
): Promise<{ error?: string }> {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    columns: { id: true },
  });
  if (!event) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };

  const maxSlot = await db.query.scheduleSlots.findFirst({
    where: eq(scheduleSlots.eventId, eventId),
    columns: { orderIndex: true },
    orderBy: desc(scheduleSlots.orderIndex),
  });
  const startIndex = (maxSlot?.orderIndex ?? -1) + 1;

  await db.insert(scheduleSlots).values(
    slots.map((slot, index) => ({
      eventId,
      clubName: slot.clubName.trim(),
      plannedStart: new Date(slot.plannedStart),
      orderIndex: startIndex + index,
    }))
  );
  return {};
}

export async function updateSlot(
  slotId: string,
  data: { clubName?: string; plannedStart?: string }
): Promise<{ error?: string }> {
  const slot = await db.query.scheduleSlots.findFirst({
    where: eq(scheduleSlots.id, slotId),
  });
  if (!slot) return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };

  const updates: { clubName?: string; plannedStart?: Date } = {};
  if (data.clubName !== undefined) updates.clubName = data.clubName.trim();
  if (data.plannedStart !== undefined) updates.plannedStart = new Date(data.plannedStart);
  if (Object.keys(updates).length === 0) return {};

  await db.update(scheduleSlots).set(updates).where(eq(scheduleSlots.id, slotId));
  return {};
}

export async function updateEvent(
  eventId: string,
  data: { name?: string; location?: string }
): Promise<{ error?: string }> {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    columns: { id: true },
  });
  if (!event) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };

  const updates: { name?: string; location?: string } = {};
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.location !== undefined) updates.location = data.location.trim();
  if (Object.keys(updates).length === 0) return {};

  await db.update(events).set(updates).where(eq(events.id, eventId));
  return {};
}

export async function setActiveEvent(eventId: string): Promise<{ error?: string }> {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    columns: { id: true },
  });
  if (!event) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };

  await db
    .insert(appConfig)
    .values({ key: "active_event_id", value: eventId })
    .onConflictDoUpdate({ target: appConfig.key, set: { value: eventId } });
  return {};
}

export async function unsetActiveEvent(): Promise<void> {
  await db.delete(appConfig).where(eq(appConfig.key, "active_event_id"));
}

export async function resetSlotsActualStart(eventId: string): Promise<{ error?: string }> {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    columns: { id: true },
  });
  if (!event) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };

  await db.update(scheduleSlots).set({ actualStart: null }).where(eq(scheduleSlots.eventId, eventId));
  await db.update(events).set({ currentSlotId: null }).where(eq(events.id, eventId));
  return {};
}

export async function deleteEvent(eventId: string): Promise<{ error?: string }> {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    columns: { id: true },
  });
  if (!event) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };

  const activeId = await getActiveEventId();
  if (activeId === eventId) {
    await unsetActiveEvent();
  }
  await db.delete(scheduleSlots).where(eq(scheduleSlots.eventId, eventId));
  await db.delete(events).where(eq(events.id, eventId));
  return {};
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
