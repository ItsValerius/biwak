import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { EventWithSlots } from "@/lib/event/client";

type AdminNextButtonProps = {
  slots: EventWithSlots["slots"];
  currentSlotId: string | null;
  onSetCurrentSlot: (slotId: string) => void;
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
  const nextSlotId = getNextSlotId(slots, currentSlotId);
  const nextSlot = nextSlotId ? slots.find((s) => s.id === nextSlotId) : null;

  return (
    <Button
      type="button"
      variant="default"
      size="lg"
      className="h-14 w-full gap-2 text-base font-medium shadow-sm md:h-16 md:text-lg hover:cursor-pointer"
      disabled={!nextSlotId}
      onClick={() => nextSlotId && onSetCurrentSlot(nextSlotId)}
      title={
        nextSlot
          ? `Nächster: ${nextSlot.clubName}`
          : "Kein weiterer Slot im Programm"
      }
    >
      Nächster
      <ChevronRight className="size-4" aria-hidden />
    </Button>
  );
}
