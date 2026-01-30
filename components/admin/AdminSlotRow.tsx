import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { formatTime } from "@/lib/event/client";

type Slot = {
  id: string;
  clubName: string;
  plannedStart: string;
  actualStart: string | null;
};

type AdminSlotRowProps = {
  slot: Slot;
  isCurrent: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSetCurrent: () => void;
  onSwapUp: () => void;
  onSwapDown: () => void;
};

export function AdminSlotRow({
  slot,
  isCurrent,
  canMoveUp,
  canMoveDown,
  onSetCurrent,
  onSwapUp,
  onSwapDown,
}: AdminSlotRowProps) {
  return (
    <div className="flex min-h-14 items-center gap-2 sm:min-h-16">
      <div className="flex shrink-0 flex-col gap-0.5">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0"
          disabled={!canMoveUp}
          title="Nach oben tauschen"
          aria-label="Nach oben tauschen"
          onClick={onSwapUp}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0"
          disabled={!canMoveDown}
          title="Nach unten tauschen"
          aria-label="Nach unten tauschen"
          onClick={onSwapDown}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
      <Button
        size="lg"
        variant={isCurrent ? "default" : "outline"}
        className="min-h-14 flex-1 flex-col items-start gap-0.5 py-3 text-base sm:min-h-16 sm:text-lg"
        onClick={onSetCurrent}
      >
        <span className="w-full text-left">{slot.clubName}</span>
        <span className="w-full text-left text-xs font-normal opacity-90 sm:text-sm">
          Geplant: {formatTime(slot.plannedStart)}
          {slot.actualStart && (
            <> · Tatsächlich: {formatTime(slot.actualStart)}</>
          )}
        </span>
      </Button>
    </div>
  );
}
