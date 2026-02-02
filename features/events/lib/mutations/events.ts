/**
 * Event CRUD and configuration.
 * For slot operations, see slots.ts. For reads, see queries.ts.
 */
import { db } from "@/lib/db";
import { events, scheduleSlots, appConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ERROR_MESSAGE, EVENT_STATUS } from "@/lib/constants";
import { findEventById } from "../repository";
import { getActiveEventId } from "../queries";

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

export async function updateEvent(
  eventId: string,
  data: { name?: string; location?: string }
): Promise<{ error?: string }> {
  const event = await findEventById(eventId);
  if (!event) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };

  const updates: { name?: string; location?: string } = {};
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.location !== undefined) updates.location = data.location.trim();
  if (Object.keys(updates).length === 0) return {};

  await db.update(events).set(updates).where(eq(events.id, eventId));
  return {};
}

export async function deleteEvent(eventId: string): Promise<{ error?: string }> {
  const event = await findEventById(eventId);
  if (!event) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };

  const activeId = await getActiveEventId();
  if (activeId === eventId) {
    await unsetActiveEvent();
  }
  await db.delete(scheduleSlots).where(eq(scheduleSlots.eventId, eventId));
  await db.delete(events).where(eq(events.id, eventId));
  return {};
}

export async function setActiveEvent(eventId: string): Promise<{ error?: string }> {
  const event = await findEventById(eventId);
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

export async function togglePause(eventId?: string): Promise<{ error?: string }> {
  const resolvedEventId = eventId ?? (await getActiveEventId()) ?? null;
  const event = resolvedEventId
    ? await findEventById(resolvedEventId)
    : await db.query.events.findFirst();
  if (!event) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };

  const newStatus =
    event.status === EVENT_STATUS.RUNNING ? EVENT_STATUS.PAUSE_UMBAU : EVENT_STATUS.RUNNING;
  await db.update(events).set({ status: newStatus }).where(eq(events.id, event.id));
  return {};
}
