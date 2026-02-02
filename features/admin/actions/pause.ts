"use server";

import { togglePause as serviceTogglePause } from "@/features/events";
import { requireAdmin, revalidate } from "@/features/admin/lib/actions-helpers";

export async function togglePause(eventId?: string) {
  await requireAdmin();
  const result = await serviceTogglePause(eventId);
  if (result.error) return { error: result.error };
  revalidate();
}
