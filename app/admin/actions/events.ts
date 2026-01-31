"use server";

import { redirect } from "next/navigation";
import {
  createEvent as serviceCreateEvent,
  updateEvent as serviceUpdateEvent,
  setActiveEvent as serviceSetActiveEvent,
  unsetActiveEvent as serviceUnsetActiveEvent,
  deleteEvent as serviceDeleteEvent,
} from "@/lib/event";
import { createEventSchema, updateEventSchema } from "@/lib/admin/schemas";
import { ERROR_MESSAGE } from "@/lib/constants";
import { requireAdmin, revalidate, parseZodError } from "@/lib/admin/actions-helpers";

export async function createEvent(values: { name: string; location: string }) {
  await requireAdmin();

  const parsed = createEventSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parseZodError(parsed.error, ERROR_MESSAGE.INVALID_EVENT_DATA) };
  }

  const result = await serviceCreateEvent(parsed.data);
  if (result.error) return { error: result.error };

  revalidate();
  redirect(`/admin?eventId=${result.id}`);
}

export async function updateEvent(
  eventId: string,
  values: { name?: string; location?: string }
) {
  await requireAdmin();

  const parsed = updateEventSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parseZodError(parsed.error, ERROR_MESSAGE.INVALID_EVENT_DATA) };
  }

  const data = parsed.data;
  if (!data.name && !data.location) {
    return { error: ERROR_MESSAGE.INVALID_EVENT_DATA };
  }

  const result = await serviceUpdateEvent(eventId, data);
  if (result.error) return { error: result.error };

  revalidate();
}

export async function setActiveEvent(eventId: string) {
  await requireAdmin();
  const result = await serviceSetActiveEvent(eventId);
  if (result.error) return { error: result.error };
  revalidate();
}

export async function unsetActiveEvent() {
  await requireAdmin();
  await serviceUnsetActiveEvent();
  revalidate();
}

export async function deleteEvent(eventId: string) {
  await requireAdmin();
  const result = await serviceDeleteEvent(eventId);
  if (result.error) return { error: result.error };
  revalidate();
  redirect("/admin");
}
