"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Pause, Play } from "lucide-react";

type AdminPauseButtonProps = {
  isPaused: boolean;
  onToggle: () => Promise<void>;
};

export function AdminPauseButton({ isPaused, onToggle }: AdminPauseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onToggle();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={isPaused ? "default" : "outline"}
      size="sm"
      className="gap-1.5"
      disabled={isLoading}
      onClick={handleToggle}
      title={isPaused ? "Weiter" : "Pause"}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : isPaused ? (
        <Play className="size-4" aria-hidden />
      ) : (
        <Pause className="size-4" aria-hidden />
      )}
      {isPaused ? "Weiter" : "Pause"}
    </Button>
  );
}
