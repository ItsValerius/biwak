import { z } from "zod";
import { ERROR_MESSAGE } from "@/lib/constants";

export const createEventSchema = z.object({
  name: z.string().min(1, ERROR_MESSAGE.NAME_AND_LOCATION_REQUIRED),
  location: z.string().min(1, ERROR_MESSAGE.NAME_AND_LOCATION_REQUIRED),
});

export const updateEventSchema = z.object({
  name: z.string().min(1, ERROR_MESSAGE.NAME_AND_LOCATION_REQUIRED).optional(),
  location: z.string().min(1, ERROR_MESSAGE.NAME_AND_LOCATION_REQUIRED).optional(),
});

export const createSlotItemSchema = z.object({
  clubName: z.string().min(1, "Club name is required"),
  plannedStart: z.string().min(1, "Planned start is required"),
});

export const updateSlotSchema = z.object({
  clubName: z.string().min(1, "Club name is required").optional(),
  plannedStart: z.string().min(1, "Planned start is required").optional(),
});

export const createSlotsSchema = z.object({
  eventId: z.string().uuid(),
  slots: z.array(createSlotItemSchema).min(1, ERROR_MESSAGE.AT_LEAST_ONE_SLOT),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type CreateSlotItemInput = z.infer<typeof createSlotItemSchema>;
export type UpdateSlotInput = z.infer<typeof updateSlotSchema>;
export type CreateSlotsInput = z.infer<typeof createSlotsSchema>;
