"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { events, scheduleSlots } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  verifyAdminPassword,
  setAdminSession,
  hasAdminSession,
} from "@/lib/auth";
import { EVENT_STATUS, ERROR_MESSAGE } from "@/lib/constants";

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
    .set({ orderIndex: slotB.orderIndex })
    .where(eq(scheduleSlots.id, slotIdA));
  await db
    .update(scheduleSlots)
    .set({ orderIndex: slotA.orderIndex })
    .where(eq(scheduleSlots.id, slotIdB));

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
