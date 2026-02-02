"use server";

import {
  setCurrentSlot as serviceSetCurrentSlot,
  swapSlots as serviceSwapSlots,
  deleteSlot as serviceDeleteSlot,
  createSlots as serviceCreateSlots,
  updateSlot as serviceUpdateSlot,
  resetSlotsActualStart as serviceResetSlotsActualStart,
  resetSlotActualStart as serviceResetSlotActualStart,
} from "@/features/events";
import {
  createSlotsSchema,
  updateSlotSchema,
} from "@/features/admin/lib/schemas";
import { parseScheduleCsv } from "@/features/admin/lib/csv-utils";
import { formatDateLocalBerlin } from "@/features/events/lib/date-utils";
import { ERROR_MESSAGE } from "@/lib/constants";
import {
  requireAdmin,
  revalidate,
  parseZodError,
} from "@/features/admin/lib/actions-helpers";

export async function setCurrentSlot(slotId: string) {
  await requireAdmin();
  const result = await serviceSetCurrentSlot(slotId);
  if (result.error) return { error: result.error };
  revalidate();
}

export async function swapSlots(slotIdA: string, slotIdB: string) {
  await requireAdmin();
  const result = await serviceSwapSlots(slotIdA, slotIdB);
  if (result.error) return { error: result.error };
  revalidate();
}

export async function deleteSlot(slotId: string) {
  await requireAdmin();
  const result = await serviceDeleteSlot(slotId);
  if (result.error) return { error: result.error };
  revalidate();
}

export async function updateSlot(
  slotId: string,
  values: { clubName?: string; plannedStart?: string }
) {
  await requireAdmin();

  const parsed = updateSlotSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parseZodError(parsed.error, ERROR_MESSAGE.INVALID_SLOT_DATA) };
  }

  const data = parsed.data;
  if (!data.clubName && !data.plannedStart) {
    return { error: ERROR_MESSAGE.INVALID_SLOT_DATA };
  }

  const result = await serviceUpdateSlot(slotId, data);
  if (result.error) return { error: result.error };

  revalidate();
}

export async function createSlots(
  eventId: string,
  slots: Array<{ clubName: string; plannedStart: string }>
) {
  await requireAdmin();

  const parsed = createSlotsSchema.safeParse({ eventId, slots });
  if (!parsed.success) {
    return { error: parseZodError(parsed.error, ERROR_MESSAGE.INVALID_SLOT_DATA) };
  }

  const result = await serviceCreateSlots(
    parsed.data.eventId,
    parsed.data.slots
  );
  if (result.error) return { error: result.error };

  revalidate();
}

export async function resetEventSlots(eventId: string) {
  await requireAdmin();
  const result = await serviceResetSlotsActualStart(eventId);
  if (result.error) return { error: result.error };
  revalidate();
}

export async function resetSlotActualStart(slotId: string) {
  await requireAdmin();
  const result = await serviceResetSlotActualStart(slotId);
  if (result.error) return { error: result.error };
  revalidate();
}

export async function importSlotsFromCsv(
  eventId: string,
  csvText: string,
  baseDateStr?: string
) {
  await requireAdmin();

  const dateOnly =
    baseDateStr && /^\d{4}-\d{2}-\d{2}$/.test(baseDateStr)
      ? baseDateStr
      : formatDateLocalBerlin();

  const parsed = parseScheduleCsv(csvText, dateOnly);
  if (parsed.error) return { error: parsed.error };

  const schemaParsed = createSlotsSchema.safeParse({
    eventId,
    slots: parsed.slots,
  });
  if (!schemaParsed.success) {
    return {
      error: parseZodError(schemaParsed.error, ERROR_MESSAGE.INVALID_SLOT_DATA),
    };
  }

  const result = await serviceCreateSlots(
    schemaParsed.data.eventId,
    schemaParsed.data.slots
  );
  if (result.error) return { error: result.error };

  revalidate();
}
