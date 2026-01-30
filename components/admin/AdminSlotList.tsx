import { AdminSlotRow } from "./AdminSlotRow";
import type { EventWithSlots } from "@/lib/event/client";

type AdminSlotListProps = {
  event: EventWithSlots["event"];
  slots: EventWithSlots["slots"];
  onSetCurrentSlot: (slotId: string) => void;
  onSwapSlots: (slotIdA: string, slotIdB: string) => void;
};

export function AdminSlotList({
  event,
  slots,
  onSetCurrentSlot,
  onSwapSlots,
}: AdminSlotListProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">
        Reihenfolge & Jetzt auf die Bühne
      </h2>
      <p className="text-muted-foreground text-sm">
        Klicke auf einen Club für „Jetzt auf der Bühne“. Mit ↑/↓ die
        Reihenfolge tauschen.
      </p>
      <div className="grid gap-2 sm:grid-cols-1">
        {slots.map((slot, index) => (
          <AdminSlotRow
            key={slot.id}
            slot={slot}
            isCurrent={event.currentSlotId === slot.id}
            canMoveUp={index > 0}
            canMoveDown={index < slots.length - 1}
            onSetCurrent={() => onSetCurrentSlot(slot.id)}
            onSwapUp={() => onSwapSlots(slot.id, slots[index - 1]!.id)}
            onSwapDown={() => onSwapSlots(slot.id, slots[index + 1]!.id)}
          />
        ))}
      </div>
    </div>
  );
}
