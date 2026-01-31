"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { events, scheduleSlots } from "@/lib/db/schema";
import { eq, max } from "drizzle-orm";
import {
  verifyAdminPassword,
  setAdminSession,
  hasAdminSession,
} from "@/lib/auth";
import { EVENT_STATUS, ERROR_MESSAGE } from "@/lib/constants";

const createEventSchema = z.object({
  name: z.string().min(1, ERROR_MESSAGE.NAME_AND_LOCATION_REQUIRED),
  location: z.string().min(1, ERROR_MESSAGE.NAME_AND_LOCATION_REQUIRED),
});

const createSlotItemSchema = z.object({
  clubName: z.string().min(1, "Club name is required"),
  plannedStart: z.string().min(1, "Planned start is required"),
});

const createSlotsSchema = z.object({
  eventId: z.string().uuid(),
  slots: z.array(createSlotItemSchema).min(1, ERROR_MESSAGE.AT_LEAST_ONE_SLOT),
});

function toggledStatus(
  current: string
): (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS] {
  return current === EVENT_STATUS.RUNNING
    ? EVENT_STATUS.PAUSE_UMBAU
    : EVENT_STATUS.RUNNING;
}

async function requireAdmin() {
  const ok = await hasAdminSession();
  if (!ok) redirect("/admin/login");
}

export async function login(prevState: unknown, formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string" || !password.trim()) {
    return { error: ERROR_MESSAGE.PASSWORD_REQUIRED };
  }
  if (!verifyAdminPassword(password)) {
    return { error: ERROR_MESSAGE.INVALID_PASSWORD };
  }
  await setAdminSession();
  redirect("/admin");
}

export async function setCurrentSlot(slotId: string) {
  await requireAdmin();

  const [slot] = await db
    .select()
    .from(scheduleSlots)
    .where(eq(scheduleSlots.id, slotId))
    .limit(1);

  if (!slot) {
    return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };
  }

  const now = new Date();
  await db
    .update(events)
    .set({ currentSlotId: slotId })
    .where(eq(events.id, slot.eventId));
  if (!slot.actualStart) {
    await db
      .update(scheduleSlots)
      .set({ actualStart: now })
      .where(eq(scheduleSlots.id, slotId));
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function swapSlots(slotIdA: string, slotIdB: string) {
  await requireAdmin();

  const [slotA, slotB] = await Promise.all([
    db
      .select()
      .from(scheduleSlots)
      .where(eq(scheduleSlots.id, slotIdA))
      .limit(1)
      .then((rows) => rows[0]),
    db
      .select()
      .from(scheduleSlots)
      .where(eq(scheduleSlots.id, slotIdB))
      .limit(1)
      .then((rows) => rows[0]),
  ]);

  if (!slotA || !slotB) {
    return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };
  }
  if (slotA.eventId !== slotB.eventId) {
    return { error: ERROR_MESSAGE.SLOTS_SAME_EVENT };
  }

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

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteSlot(slotId: string) {
  await requireAdmin();

  const [slot] = await db
    .select()
    .from(scheduleSlots)
    .where(eq(scheduleSlots.id, slotId))
    .limit(1);

  if (!slot) {
    return { error: ERROR_MESSAGE.SLOT_NOT_FOUND };
  }

  const [event] = await db
    .select({ currentSlotId: events.currentSlotId })
    .from(events)
    .where(eq(events.id, slot.eventId))
    .limit(1);

  if (event?.currentSlotId === slotId) {
    await db
      .update(events)
      .set({ currentSlotId: null })
      .where(eq(events.id, slot.eventId));
  }

  await db.delete(scheduleSlots).where(eq(scheduleSlots.id, slotId));

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function togglePause(eventId?: string) {
  await requireAdmin();

  const resolvedEventId =
    eventId ?? process.env.NEXT_PUBLIC_DEFAULT_EVENT_ID ?? null;
  const [event] = resolvedEventId
    ? await db.select().from(events).where(eq(events.id, resolvedEventId)).limit(1)
    : await db.select().from(events).limit(1);

  if (!event) {
    return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };
  }

  const newStatus = toggledStatus(event.status);
  await db
    .update(events)
    .set({ status: newStatus })
    .where(eq(events.id, event.id));

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createEvent(values: z.infer<typeof createEventSchema>) {
  await requireAdmin();

  const parsed = createEventSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().formErrors[0] ?? ERROR_MESSAGE.INVALID_EVENT_DATA,
    };
  }

  const [newEvent] = await db
    .insert(events)
    .values({
      name: parsed.data.name.trim(),
      location: parsed.data.location.trim(),
      status: EVENT_STATUS.RUNNING,
    })
    .returning();

  if (!newEvent) {
    return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect(`/admin?eventId=${newEvent.id}`);
}

export async function createSlots(
  eventId: string,
  slots: z.infer<typeof createSlotsSchema>["slots"]
) {
  await requireAdmin();

  const parsed = createSlotsSchema.safeParse({ eventId, slots });
  if (!parsed.success) {
    return {
      error:
        parsed.error.flatten().formErrors[0] ?? ERROR_MESSAGE.INVALID_SLOT_DATA,
    };
  }

  const [event] = await db
    .select({ id: events.id })
    .from(events)
    .where(eq(events.id, parsed.data.eventId))
    .limit(1);

  if (!event) {
    return { error: ERROR_MESSAGE.EVENT_NOT_FOUND };
  }

  const [maxRow] = await db
    .select({ maxOrder: max(scheduleSlots.orderIndex) })
    .from(scheduleSlots)
    .where(eq(scheduleSlots.eventId, parsed.data.eventId));
  const startIndex = (maxRow?.maxOrder ?? -1) + 1;

  const values = parsed.data.slots.map((slot, index) => ({
    eventId: parsed.data.eventId,
    clubName: slot.clubName.trim(),
    plannedStart: new Date(slot.plannedStart),
    orderIndex: startIndex + index,
  }));

  await db.insert(scheduleSlots).values(values);

  revalidatePath("/admin");
  revalidatePath("/");
}
