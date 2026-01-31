"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminScheduleForm } from "./AdminScheduleForm";

type AdminAddSlotsDialogProps = {
  eventId: string;
};

export function AdminAddSlotsDialog({ eventId }: AdminAddSlotsDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          + Slots hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle>Weitere Slots hinzufügen</DialogTitle>
          <DialogDescription>
            Zusätzliche Slots mit Club-Name und geplanter Startzeit anlegen.
          </DialogDescription>
        </DialogHeader>
        <AdminScheduleForm
          eventId={eventId}
          hideHeader
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
