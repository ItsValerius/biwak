import type { Slot } from "../types";
import { getMinutesPastPlanned, getMinutesSlotDeviation } from "./slot-utils";

/**
 * Schedule deviation badge for the "Up Next" section.
 * - behind: slot started late or we're past next slot's planned start (overrun)
 * - ahead: current slot actually started early
 */
export type ScheduleDeviationBadge =
  | { label: string; variant: "behind" }
  | { label: string; variant: "ahead" };

/**
 * Computes the schedule deviation badge for the "Up Next" section.
 * - behind: slot started late or we're past next slot's planned start (overrun)
 * - ahead: only when current slot actually started early (not when next slot is simply in the future)
 */
export function getScheduleDeviationBadge(
  currentSlot: Slot | null,
  nextSlot: Slot | null,
  now: Date
): ScheduleDeviationBadge | null {
  const startDeviation = getMinutesSlotDeviation(currentSlot);
  const overrun =
    nextSlot !== null ? getMinutesPastPlanned(nextSlot.plannedStart, now) : null;

  // behind: current slot started late, OR we're past next slot's planned start (overrun)
  const behindMinutes = Math.max(
    startDeviation > 0 ? startDeviation : 0,
    overrun !== null && overrun > 0 ? overrun : 0
  );

  if (behindMinutes > 0) {
    return { label: `+${behindMinutes} Min.`, variant: "behind" };
  }
  if (startDeviation < 0) {
    return { label: `${startDeviation} Min.`, variant: "ahead" };
  }
  return null;
}
