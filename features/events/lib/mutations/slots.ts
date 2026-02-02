/**
 * Slot CRUD and schedule operations.
 * For event operations, see events.ts. For reads, see queries.ts.
 */
import { db } from "@/lib/db";
import { events, scheduleSlots } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ERROR_MESSAGE } from "@/lib/constants";
import {
  findEventById,
  findSlotById,
  findPreviousSlotWithActualStart,
} from "../repository";

export async function setCurrentSlot(
  slotId: string
): Promise<{ error?: string }> {
  const slot = await findSlotById(slotId);
  if (!slot) return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };

  const now = new Date();
  await db.update(events).set({ currentSlotId: slotId }).where(eq(events.id, slot.eventId));
  if (!slot.actualStart) {
    await db
      .update(scheduleSlots)
      .set({ actualStart: now })
      .where(eq(scheduleSlots.id, slotId));
  }
  return {};
}

export async function swapSlots(
  slotIdA: string,
  slotIdB: string
): Promise<{ error?: string }> {
  const [slotA, slotB] = await Promise.all([
    findSlotById(slotIdA),
    findSlotById(slotIdB),
  ]);
  if (!slotA || !slotB) return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };
  if (slotA.eventId !== slotB.eventId) return { error: ERROR_MESSAGE.SLOTS_SAME_EVENT };

  await db
    .update(scheduleSlots)
    .set({
      orderIndex: slotB.orderIndex,
      plannedStart: slotB.plannedStart,
      actualStart: slotB.actualStart,
    })
    .where(eq(scheduleSlots.id, slotIdA));
  await db
    .update(scheduleSlots)
    .set({
      orderIndex: slotA.orderIndex,
      plannedStart: slotA.plannedStart,
      actualStart: slotA.actualStart,
    })
    .where(eq(scheduleSlots.id, slotIdB));
  return {};
}

export async function deleteSlot(slotId: string): Promise<{ error?: string }> {
  const slot = await findSlotById(slotId);
  if (!slot) return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };

  const event = await findEventById(slot.eventId);
  if (event?.currentSlotId === slotId) {
    await db
      .update(events)
      .set({ currentSlotId: null })
      .where(eq(events.id, slot.eventId));
  }
  await db.delete(scheduleSlots).where(eq(scheduleSlots.id, slotId));
  return {};
}

export async function updateSlot(
  slotId: string,
  data: { clubName?: string; plannedStart?: string }
): Promise<{ error?: string }> {
  const slot = await findSlotById(slotId);
  if (!slot) return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };

  const updates: { clubName?: string; plannedStart?: Date } = {};
  if (data.clubName !== undefined) updates.clubName = data.clubName.trim();
  if (data.plannedStart !== undefined)
    updates.plannedStart = new Date(data.plannedStart);
  if (Object.keys(updates).length === 0) return {};

  await db.update(scheduleSlots).set(updates).where(eq(scheduleSlots.id, slotId));
  return {};
}

export async function createSlots(
  eventId: string,
  slots: Array<{ clubName: string; plannedStart: string }>
): Promise<{ error?: string }> {
  const event = await findEventById(eventId);
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

export async function resetSlotsActualStart(
  eventId: string
): Promise<{ error?: string }> {
  const event = await findEventById(eventId);
  if (!event) return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };

  await db
    .update(scheduleSlots)
    .set({ actualStart: null })
    .where(eq(scheduleSlots.eventId, eventId));
  await db.update(events).set({ currentSlotId: null }).where(eq(events.id, eventId));
  return {};
}

export async function resetSlotActualStart(
  slotId: string
): Promise<{ error?: string }> {
  const slot = await findSlotById(slotId);
  if (!slot) return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };

  await db
    .update(scheduleSlots)
    .set({ actualStart: null })
    .where(eq(scheduleSlots.id, slotId));

  const event = await findEventById(slot.eventId);
  if (event?.currentSlotId === slotId) {
    const previousSlot = await findPreviousSlotWithActualStart(
      slot.eventId,
      slot.orderIndex
    );
    const newCurrentSlotId = previousSlot?.actualStart ? previousSlot.id : null;
    await db
      .update(events)
      .set({ currentSlotId: newCurrentSlotId })
      .where(eq(events.id, slot.eventId));
  }
  return {};
}
