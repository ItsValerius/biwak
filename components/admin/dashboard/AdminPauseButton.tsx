"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Pause, Play } from "lucide-react";

type AdminPauseButtonProps = {
  isPaused: boolean;
  onToggle: () => void | Promise<void>;
};

export function AdminPauseButton({ isPaused, onToggle }: AdminPauseButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={isPaused ? "default" : "outline"}
      size="sm"
      className="gap-1.5"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await onToggle();
        });
      }}
      title={isPaused ? "Weiter" : "Pause"}
    >
      {isPending ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
      ) : isPaused ? (
        <Play className="size-4 shrink-0" aria-hidden />
      ) : (
        <Pause className="size-4 shrink-0" aria-hidden />
      )}
      {isPaused ? "Weiter" : "Pause"}
    </Button>
  );
}
