"use client";

import { useRouter } from "next/navigation";
import { EVENT_STATUS } from "@/lib/constants";
import {
  setCurrentSlot,
  swapSlots,
  deleteSlot,
  togglePause,
  resetEventSlots,
} from "./actions";
import type { EventWithSlots } from "@/lib/event/client";
import {
  AdminEventHeader,
  AdminNextButton,
  AdminSlotList,
} from "@/components/admin";

type AdminDashboardProps = {
  event: EventWithSlots["event"];
  slots: EventWithSlots["slots"];
};

export function AdminDashboard({ event, slots }: AdminDashboardProps) {
  const router = useRouter();
  const isPaused = event.status === EVENT_STATUS.PAUSE_UMBAU;

  async function handleSetCurrentSlot(slotId: string) {
    await setCurrentSlot(slotId);
    router.refresh();
  }

  async function handleSwapSlots(slotIdA: string, slotIdB: string) {
    await swapSlots(slotIdA, slotIdB);
    router.refresh();
  }

  async function handleDeleteSlot(slotId: string) {
    await deleteSlot(slotId);
    router.refresh();
  }

  async function handleTogglePause() {
    await togglePause(event.id);
    router.refresh();
  }

  async function handleResetSlots() {
    await resetEventSlots(event.id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <AdminEventHeader event={event} />
      <AdminNextButton
        slots={slots}
        currentSlotId={event.currentSlotId}
        onSetCurrentSlot={handleSetCurrentSlot}
      />
      <AdminSlotList
        event={event}
        slots={slots}
        isPaused={isPaused}
        onSwapSlots={handleSwapSlots}
        onDeleteSlot={handleDeleteSlot}
        onTogglePause={handleTogglePause}
        onResetSlots={handleResetSlots}
      />
    </div>
  );
}
