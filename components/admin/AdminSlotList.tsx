import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminSlotRow } from "./AdminSlotRow";
import type { EventWithSlots } from "@/lib/event/client";

type AdminSlotListProps = {
  event: EventWithSlots["event"];
  slots: EventWithSlots["slots"];
  onSetCurrentSlot: (slotId: string) => void;
  onSwapSlots: (slotIdA: string, slotIdB: string) => void;
  onDeleteSlot: (slotId: string) => void;
};

export function AdminSlotList({
  event,
  slots,
  onSetCurrentSlot,
  onSwapSlots,
  onDeleteSlot,
}: AdminSlotListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reihenfolge & Jetzt auf die Bühne</CardTitle>
        <CardDescription>
          Klicke auf einen Club für „Jetzt auf der Bühne“. Mit ↑/↓ die
          Reihenfolge tauschen. Mit dem Papierkorb-Symbol einen Slot entfernen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
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
            onDelete={() => onDeleteSlot(slot.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
