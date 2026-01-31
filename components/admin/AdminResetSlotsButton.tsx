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
import { Loader2, RotateCcw } from "lucide-react";

type AdminResetSlotsButtonProps = {
  onReset: () => Promise<void>;
};

export function AdminResetSlotsButton({ onReset }: AdminResetSlotsButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleReset() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onReset();
      setConfirmOpen(false);
    } finally {
      setIsLoading(false);
    }
  }

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
      <Dialog open={confirmOpen} onOpenChange={(open) => !isLoading && setConfirmOpen(open)}>
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
            <Button 
              variant="outline" 
              onClick={() => setConfirmOpen(false)}
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Zurücksetzen…
                </>
              ) : (
                "Zurücksetzen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
