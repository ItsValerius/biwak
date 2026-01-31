"use client";

import { useState } from "react";
import { MapPin, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminEditEventDialog } from "./AdminEditEventDialog";
import { AdminDeleteEventButton } from "./AdminDeleteEventButton";

type Event = {
  id: string;
  name: string;
  location: string;
};

export function AdminEventHeader({ event }: { event: Event }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Card className="min-w-0 border-primary/20 shadow-sm">
        <CardHeader className="flex-row items-start justify-between gap-2 pb-2">
          <CardTitle className="min-w-0 wrap-break-word text-2xl font-semibold tracking-tight">
            {event.name}
          </CardTitle>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setEditOpen(true)}
              title="Event bearbeiten"
              aria-label="Event bearbeiten"
            >
              <Pencil className="size-4" />
            </Button>
            <AdminDeleteEventButton
              eventId={event.id}
              eventName={event.name}
            />
          </div>
        </CardHeader>
        <CardContent className="min-w-0 pt-0">
          <p className="flex min-w-0 items-center gap-2 wrap-break-word text-muted-foreground text-sm">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0">{event.location}</span>
          </p>
        </CardContent>
      </Card>
      <AdminEditEventDialog
        event={event}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
