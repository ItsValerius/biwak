import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

type AdminPauseButtonProps = {
  isPaused: boolean;
  onToggle: () => void;
};

export function AdminPauseButton({ isPaused, onToggle }: AdminPauseButtonProps) {
  return (
    <Button
      type="button"
      variant={isPaused ? "default" : "outline"}
      size="sm"
      className="gap-1.5"
      onClick={() => void onToggle()}
      title={isPaused ? "Weiter" : "Pause"}
    >
      {isPaused ? (
        <Play className="size-4" aria-hidden />
      ) : (
        <Pause className="size-4" aria-hidden />
      )}
      {isPaused ? "Weiter" : "Pause"}
    </Button>
  );
}
