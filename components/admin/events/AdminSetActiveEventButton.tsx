"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setActiveEvent, unsetActiveEvent } from "@/app/admin/actions";
import { Radio, X } from "lucide-react";

type AdminSetActiveEventButtonProps = {
  eventId: string;
  isActive: boolean;
};

export function AdminSetActiveEventButton({
  eventId,
  isActive,
}: AdminSetActiveEventButtonProps) {
  const router = useRouter();

  async function handleSetActive() {
    await setActiveEvent(eventId);
    router.refresh();
  }

  async function handleUnsetActive() {
    await unsetActiveEvent();
    router.refresh();
  }

  if (isActive) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={handleUnsetActive}
        className="gap-1.5"
      >
        <X className="size-4" aria-hidden />
        Von Startseite entfernen
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSetActive}
      className="gap-1.5"
    >
      <Radio className="size-4" aria-hidden />
      Jetzt live anzeigen
    </Button>
  );
}
