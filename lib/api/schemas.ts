import { z } from "zod";
import { eventSelectSchema, scheduleSlotSelectSchema } from "@/lib/db/schemas-zod";

/** GET /api/event response: event + slots with serialized dates (ISO strings) */
const serializedSlotResponseSchema = scheduleSlotSelectSchema
  .omit({ plannedStart: true, actualStart: true })
  .extend({
    plannedStart: z.string(),
    actualStart: z.string().nullable(),
  });

export const getEventResponseSchema = z.object({
  event: eventSelectSchema,
  slots: z.array(serializedSlotResponseSchema),
});

export type GetEventResponse = z.infer<typeof getEventResponseSchema>;

export type ApiErrorResponse = { error: string };

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };
