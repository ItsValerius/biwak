"use server";

import { togglePause as serviceTogglePause } from "@/lib/event";
import { requireAdmin, revalidate } from "@/lib/admin/actions-helpers";

export async function togglePause(eventId?: string) {
  await requireAdmin();
  const result = await serviceTogglePause(eventId);
  if (result.error) return { error: result.error };
  revalidate();
}
