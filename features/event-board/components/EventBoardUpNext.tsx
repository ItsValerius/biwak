import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { ChevronRight } from "lucide-react";
import { formatTime } from "@/features/events/lib/client";
import type { ScheduleDeviationBadge } from "@/features/events/lib/client";
import { DelayBadge } from "./DelayBadge";

type Slot = {
  id: string;
  clubName: string;
  plannedStart: string;
};

type EventBoardUpNextProps = {
  slots: Slot[];
  scheduleDeviationBadge: ScheduleDeviationBadge | null;
};

export function EventBoardUpNext({
  slots,
  scheduleDeviationBadge,
}: EventBoardUpNextProps) {
  return (
    <Card className="border-border bg-card tv:rounded-2xl">
      <CardHeader className="pb-2 lg:px-8 lg:pb-4 lg:pt-8 tv:px-14 tv:pb-6 tv:pt-12">
        <div className="flex flex-wrap items-center gap-2 gap-y-1">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground lg:text-base tv:text-[clamp(1rem,1.5vw,1.75rem)]">
            Als Nächstes
          </h3>
          {scheduleDeviationBadge && (
            <DelayBadge
              label={scheduleDeviationBadge.label}
              variant={scheduleDeviationBadge.variant}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 lg:px-8 lg:pb-8 tv:px-14 tv:pb-12">
        {slots.length === 0 ? (
          <p className="py-4 text-muted-foreground lg:py-0 tv:py-6 tv:text-[clamp(1.25rem,2vw,2rem)]">
            —
          </p>
        ) : (
          <ul className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-4 tv:gap-6">
            {slots.map((slot, index) => (
              <li
                key={slot.id}
                className={`flex items-center justify-between py-4 lg:flex-col lg:items-start lg:rounded-xl lg:bg-secondary/30 lg:p-5 tv:rounded-2xl tv:p-8 ${index !== slots.length - 1
                  ? "border-b border-border/50 lg:border-b-0"
                  : ""
                  }`}
              >
                <div className="flex items-center gap-3 lg:w-full lg:flex-col lg:items-start lg:gap-2 tv:gap-3">
                  <ChevronRight className="size-4 text-primary lg:size-5 lg:hidden tv:hidden" />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-foreground lg:text-xl tv:text-[clamp(1.5rem,2.5vw,3rem)]">
                      {slot.clubName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:mt-3 lg:flex-col lg:items-end tv:mt-4 tv:gap-3">
                  <span className="text-sm font-mono text-muted-foreground lg:text-base tv:text-[clamp(1.25rem,2vw,2rem)]">
                    {formatTime(slot.plannedStart)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
