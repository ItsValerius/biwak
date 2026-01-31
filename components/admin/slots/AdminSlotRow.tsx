"use client";

import { useState } from "react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, Trash2, Pencil, Loader2 } from "lucide-react";
import { formatTime } from "@/lib/event/client";
import { AdminEditSlotDialog } from "./AdminEditSlotDialog";

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
  onSwapUp: () => void | Promise<void>;
  onSwapDown: () => void | Promise<void>;
  onDelete: () => void | Promise<void>;
};

export function AdminSlotRow({
  slot,
  isCurrent,
  canMoveUp,
  canMoveDown,
  onSwapUp,
  onSwapDown,
  onDelete,
}: AdminSlotRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div className="flex min-h-14 min-w-0 items-center gap-2 sm:min-h-16">
        <div className="flex shrink-0 flex-col gap-0.5">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0"
          disabled={!canMoveUp || isPending}
          title="Nach oben tauschen"
          aria-label="Nach oben tauschen"
          onClick={() => startTransition(async () => { await onSwapUp(); })}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0"
          disabled={!canMoveDown || isPending}
          title="Nach unten tauschen"
          aria-label="Nach unten tauschen"
          onClick={() => startTransition(async () => { await onSwapDown(); })}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
        <div
          className={`flex min-h-14 min-w-0 flex-1 flex-col justify-center gap-0.5 rounded-lg border px-4 py-3 sm:min-h-16 ${
            isCurrent
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-muted/30"
          }`}
        >
          <span className="w-full wrap-break-word text-left text-base sm:text-lg" title={slot.clubName}>
            {slot.clubName}
          </span>
          <span className="w-full shrink-0 text-left text-xs font-normal opacity-90 sm:text-sm">
            Geplant: {formatTime(slot.plannedStart)}
            {slot.actualStart && (
              <> · Tatsächlich: {formatTime(slot.actualStart)}</>
            )}
          </span>
        </div>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0"
          title="Slot bearbeiten"
          aria-label="Slot bearbeiten"
          disabled={isPending}
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Slot entfernen"
          aria-label="Slot entfernen"
          disabled={isPending}
          onClick={() => setDeleteConfirmOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <AdminEditSlotDialog
        slot={slot}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Slot entfernen?</DialogTitle>
            <DialogDescription>
              Möchtest du „{slot.clubName}“ wirklich aus dem Programm entfernen?
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isPending}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  await onDelete();
                  setDeleteConfirmOpen(false);
                });
              }}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                "Entfernen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
