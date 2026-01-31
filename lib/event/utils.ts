export type Slot = {
  id: string;
  eventId: string;
  clubName: string;
  plannedStart: string;
  orderIndex: number;
  actualStart: string | null;
};

export type Event = {
  id: string;
  name: string;
  location: string;
  status: "running" | "pause_umbau";
  currentSlotId: string | null;
};

export function getCurrentSlot(slots: Slot[], currentSlotId: string | null): Slot | null {
  if (!currentSlotId) return null;
  return slots.find((s) => s.id === currentSlotId) ?? null;
}

export function getNextSlots(slots: Slot[], currentSlotId: string | null, count = 2): Slot[] {
  const idx = currentSlotId
    ? slots.findIndex((s) => s.id === currentSlotId)
    : -1;
  const start = idx < 0 ? 0 : idx + 1;
  return slots.slice(start, start + count);
}

/** Minutes past a planned start time (positive = late). */
export function getMinutesPastPlanned(plannedStartIso: string, now: Date): number {
  const planned = new Date(plannedStartIso).getTime();
  return Math.round((now.getTime() - planned) / 60_000);
}

/** Minutes the slot was started late (0 if on time or no actualStart). */
export function getMinutesSlotStartedLate(slot: Slot | null): number {
  if (!slot?.actualStart) return 0;
  const minutes = getMinutesPastPlanned(slot.plannedStart, new Date(slot.actualStart));
  return Math.max(0, minutes);
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
