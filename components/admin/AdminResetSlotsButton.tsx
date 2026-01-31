"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RotateCcw } from "lucide-react";

type AdminResetSlotsButtonProps = {
  onReset: () => void;
};

export function AdminResetSlotsButton({ onReset }: AdminResetSlotsButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => setConfirmOpen(true)}
        title="Tatsächliche Startzeiten und aktuellen Slot zurücksetzen"
      >
        <RotateCcw className="size-4" aria-hidden />
        Zurücksetzen
      </Button>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Zeiten zurücksetzen?</DialogTitle>
            <DialogDescription>
              Alle tatsächlichen Startzeiten und der aktuelle Slot werden
              zurückgesetzt. Das Programm bleibt unverändert, aber alle Slots
              gelten wieder als nicht gestartet. Diese Aktion kann nicht
              rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onReset();
              }}
            >
              Zurücksetzen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
