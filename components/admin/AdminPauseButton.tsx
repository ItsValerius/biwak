import { Button } from "@/components/ui/button";

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
      className="h-16 w-full text-lg"
      onClick={() => void onToggle()}
    >
      {isPaused ? "Weiter (Pause beenden)" : "Pause / Umbau"}
    </Button>
  );
}
