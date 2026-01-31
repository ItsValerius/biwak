"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { deleteEvent } from "@/app/admin/actions";

type AdminDeleteEventButtonProps = {
  eventId: string;
  eventName: string;
};

export function AdminDeleteEventButton({
  eventId,
  eventName,
}: AdminDeleteEventButtonProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDelete() {
    const result = await deleteEvent(eventId);
    if (result?.error) return;
    setConfirmOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setConfirmOpen(true)}
        title="Event löschen"
        aria-label="Event löschen"
      >
        <Trash2 className="size-4" />
      </Button>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event löschen?</DialogTitle>
            <DialogDescription>
              Möchtest du „{eventName}“ wirklich löschen? Alle Slots und das
              gesamte Programm werden unwiderruflich entfernt. Diese Aktion kann
              nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDelete()}
            >
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
