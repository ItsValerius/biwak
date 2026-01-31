"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import type { EventWithSlots } from "@/lib/event/client";

type AdminNextButtonProps = {
  slots: EventWithSlots["slots"];
  currentSlotId: string | null;
  onSetCurrentSlot: (slotId: string) => Promise<void>;
};

function getNextSlotId(
  slots: EventWithSlots["slots"],
  currentSlotId: string | null
): string | null {
  const idx = currentSlotId
    ? slots.findIndex((s) => s.id === currentSlotId)
    : -1;
  const nextIndex = idx < 0 ? 0 : idx + 1;
  return slots[nextIndex]?.id ?? null;
}

export function AdminNextButton({
  slots,
  currentSlotId,
  onSetCurrentSlot,
}: AdminNextButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const nextSlotId = getNextSlotId(slots, currentSlotId);
  const nextSlot = nextSlotId ? slots.find((s) => s.id === nextSlotId) : null;

  async function handleClick() {
    if (!nextSlotId || isLoading) return;
    setIsLoading(true);
    try {
      await onSetCurrentSlot(nextSlotId);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="default"
      size="lg"
      className="h-14 w-full gap-2 text-base font-medium shadow-sm md:h-16 md:text-lg hover:cursor-pointer"
      disabled={!nextSlotId || isLoading}
      onClick={handleClick}
      title={
        nextSlot
          ? `Nächster: ${nextSlot.clubName}`
          : "Kein weiterer Slot im Programm"
      }
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <>
          Nächster
          <ChevronRight className="size-4" aria-hidden />
        </>
      )}
    </Button>
  );
}
