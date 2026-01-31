"use client";

import { useRouter } from "next/navigation";
import { EVENT_STATUS } from "@/lib/constants";
import {
  setCurrentSlot,
  swapSlots,
  deleteSlot,
  togglePause,
} from "./actions";
import type { EventWithSlots } from "@/lib/event/client";
import { AdminEventHeader } from "@/components/admin/AdminEventHeader";
import { AdminPauseButton } from "@/components/admin/AdminPauseButton";
import { AdminSlotList } from "@/components/admin/AdminSlotList";

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

  return (
    <div className="space-y-6">
      <AdminEventHeader event={event} />
      <AdminPauseButton
        isPaused={isPaused}
        onToggle={handleTogglePause}
      />
      <AdminSlotList
        event={event}
        slots={slots}
        onSetCurrentSlot={handleSetCurrentSlot}
        onSwapSlots={handleSwapSlots}
        onDeleteSlot={handleDeleteSlot}
      />
    </div>
  );
}
