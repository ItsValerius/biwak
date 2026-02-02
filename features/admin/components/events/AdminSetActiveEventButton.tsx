"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { setActiveEvent, unsetActiveEvent } from "@/features/admin/actions";
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
  const [isPending, startTransition] = useTransition();

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
        disabled={isPending}
        onClick={() => startTransition(async () => { await handleUnsetActive(); })}
        className="gap-1.5"
      >
        {isPending ? (
          <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
        ) : (
          <X className="size-4 shrink-0" aria-hidden />
        )}
        Von Startseite entfernen
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(async () => { await handleSetActive(); })}
      className="gap-1.5"
    >
      {isPending ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <Radio className="size-4 shrink-0" aria-hidden />
      )}
      Jetzt live anzeigen
    </Button>
  );
}
