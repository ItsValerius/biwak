"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { AdminScheduleForm } from "./AdminScheduleForm";
import { AdminImportCsv } from "./AdminImportCsv";

type AdminAddSlotsDialogProps = {
  eventId: string;
};

type AddMode = "manual" | "csv";

export function AdminAddSlotsDialog({ eventId }: AdminAddSlotsDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AddMode>("manual");

  function handleSuccess() {
    setOpen(false);
    setMode("manual");
  }

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
            Zusätzliche Slots manuell anlegen oder aus einer CSV-Datei (name, time) importieren.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 border-b pb-3">
          <Button
            type="button"
            variant={mode === "manual" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("manual")}
          >
            Manuell
          </Button>
          <Button
            type="button"
            variant={mode === "csv" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("csv")}
          >
            Aus CSV importieren
          </Button>
        </div>
        {mode === "manual" ? (
          <AdminScheduleForm
            eventId={eventId}
            hideHeader
            onSuccess={handleSuccess}
          />
        ) : (
          <AdminImportCsv eventId={eventId} onSuccess={handleSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
}
