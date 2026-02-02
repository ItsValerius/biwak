import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Clock } from "lucide-react";
import { formatTime } from "@/features/events/lib/client";

type Slot = {
  id: string;
  clubName: string;
  plannedStart: string;
  actualStart: string | null;
};

type EventBoardNowOnStageProps = {
  isPaused: boolean;
  currentSlot: Slot | null;
};

export function EventBoardNowOnStage({
  isPaused,
  currentSlot,
}: EventBoardNowOnStageProps) {
  return (
    <Card className="relative overflow-hidden border-primary/30 bg-primary/10 tv:rounded-2xl">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
      <CardContent className="relative pt-6 pb-6 lg:px-10 lg:pt-10 lg:pb-10 tv:px-14 tv:py-14">
        <div className="mb-4 flex items-center justify-between lg:mb-6 tv:mb-10">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground lg:text-base tv:text-[clamp(1rem,1.5vw,1.75rem)]">
            Jetzt auf der Bühne
          </span>
          {!isPaused && currentSlot && (
            <Badge className="animate-pulse border-0 bg-karneval-live px-3 py-1 text-white lg:px-4 lg:py-1 lg:text-base tv:px-6 tv:py-2 tv:text-[clamp(1rem,1.5vw,1.5rem)]">
              <span className="relative mr-2 flex size-2 lg:size-3 tv:size-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-white lg:size-3 tv:size-4" />
              </span>
              LIVE
            </Badge>
          )}
        </div>

        {isPaused ? (
          <p className="text-xl text-muted-foreground lg:text-3xl tv:text-[clamp(2rem,3.5vw,4.5rem)]">
            Pause / Umbau
          </p>
        ) : currentSlot ? (
          <div className="flex flex-col gap-2 lg:gap-3 tv:gap-4">
            <h2 className="text-3xl font-bold leading-tight text-foreground lg:text-5xl xl:text-6xl tv:text-[clamp(3rem,6vw,8rem)]">
              {currentSlot.clubName}
            </h2>
          </div>
        ) : (
          <p className="text-xl text-muted-foreground lg:text-3xl tv:text-[clamp(2rem,3vw,4rem)]">
            Noch keine Gruppe
          </p>
        )}

        {!isPaused && currentSlot && (
          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border/50 pt-4 lg:mt-8 lg:gap-6 lg:pt-6 tv:mt-10 tv:gap-8 tv:pt-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4 lg:size-5 tv:size-8" />
              <span className="text-sm lg:text-lg tv:text-[clamp(1.25rem,2vw,2.25rem)]">
                Geplant: {formatTime(currentSlot.plannedStart)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
