"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setActiveEvent, unsetActiveEvent } from "@/app/admin/actions";
import { Loader2, Radio, X } from "lucide-react";

type AdminSetActiveEventButtonProps = {
  eventId: string;
  isActive: boolean;
};

export function AdminSetActiveEventButton({
  eventId,
  isActive,
}: AdminSetActiveEventButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSetActive() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await setActiveEvent(eventId);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnsetActive() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await unsetActiveEvent();
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  if (isActive) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={handleUnsetActive}
        disabled={isLoading}
        className="gap-1.5"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <X className="size-4" aria-hidden />
        )}
        Von Startseite entfernen
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSetActive}
      disabled={isLoading}
      className="gap-1.5"
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Radio className="size-4" aria-hidden />
      )}
      Jetzt live anzeigen
    </Button>
  );
}
