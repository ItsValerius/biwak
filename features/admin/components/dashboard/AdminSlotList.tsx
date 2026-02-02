import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { AdminSlotRow } from "./AdminSlotRow";
import { AdminPauseButton } from "./AdminPauseButton";
import { AdminResetSlotsButton } from "./AdminResetSlotsButton";
import type { EventWithSlots } from "@/features/events/lib/client";

type AdminSlotListProps = {
  event: EventWithSlots["event"];
  slots: EventWithSlots["slots"];
  isPaused: boolean;
  onSwapSlots: (slotIdA: string, slotIdB: string) => void | Promise<void>;
  onDeleteSlot: (slotId: string) => void | Promise<void>;
  onResetSlotActualStart: (slotId: string) => void | Promise<void>;
  onTogglePause: () => void | Promise<void>;
  onResetSlots: () => void | Promise<void>;
};

export function AdminSlotList({
  event,
  slots,
  isPaused,
  onSwapSlots,
  onDeleteSlot,
  onResetSlotActualStart,
  onTogglePause,
  onResetSlots,
}: AdminSlotListProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg">Reihenfolge & Jetzt auf die Bühne</CardTitle>
            <CardDescription>
              Mit „Nächster“ den nächsten Club auf die Bühne holen. Mit ↑/↓ die
              Reihenfolge tauschen. Mit dem Stift-Symbol einen Slot bearbeiten,
              mit dem Papierkorb-Symbol entfernen.
            </CardDescription>
          </div>
          <div className="flex shrink-0 gap-2">
            <AdminPauseButton isPaused={isPaused} onToggle={onTogglePause} />
            <AdminResetSlotsButton onReset={onResetSlots} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {slots.map((slot, index) => (
          <AdminSlotRow
            key={slot.id}
            slot={slot}
            isCurrent={event.currentSlotId === slot.id}
            canMoveUp={index > 0}
            canMoveDown={index < slots.length - 1}
            onSwapUp={() => onSwapSlots(slot.id, slots[index - 1]!.id)}
            onSwapDown={() => onSwapSlots(slot.id, slots[index + 1]!.id)}
            onDelete={() => onDeleteSlot(slot.id)}
            onResetActualStart={() => onResetSlotActualStart(slot.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
