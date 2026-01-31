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
      variant={isPaused ? "default" : "secondary"}
      size="lg"
      className="group h-14 w-full gap-2 text-base font-medium shadow-sm md:h-16 md:text-lg hover:cursor-pointer"
      onClick={() => void onToggle()}
    >
      <span
        key={isPaused ? "play" : "pause"}
        className="inline-flex shrink-0 origin-center transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-95"
      >
        {isPaused ? (
          <Play className="size-5 animate-in fade-in zoom-in-95 duration-200" aria-hidden />
        ) : (
          <Pause className="size-5 animate-in fade-in zoom-in-95 duration-200" aria-hidden />
        )}
      </span>
      Pause / Weiter
    </Button>
  );
}
