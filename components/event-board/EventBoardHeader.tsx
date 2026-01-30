import { Card, CardHeader } from "@/components/ui/card";
import { MapPin } from "lucide-react";

type Event = {
  name: string;
  location: string;
};

export function EventBoardHeader({ event }: { event: Event }) {
  return (
    <Card className="border-border bg-card tv:rounded-2xl">
      <CardHeader className="pb-3 lg:px-8 lg:pb-6 lg:pt-8 tv:px-14 tv:pb-10 tv:pt-12">
        <div className="flex items-start gap-4 lg:gap-6 tv:gap-10">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/20 lg:size-20 lg:rounded-2xl tv:size-28 tv:rounded-3xl">
            <span className="text-2xl font-bold text-primary lg:text-4xl tv:text-[clamp(2.5rem,4vw,5rem)]">
              K
            </span>
          </div>
          <div className="flex flex-col gap-1 lg:gap-2 tv:gap-3">
            <h1 className="text-balance text-2xl font-bold text-foreground lg:text-4xl xl:text-5xl tv:text-[clamp(2.5rem,4vw,5.5rem)]">
              {event.name}
            </h1>
            <div className="flex flex-col gap-1 text-muted-foreground text-sm lg:flex-row lg:gap-6 lg:text-base tv:text-[clamp(1rem,1.5vw,2rem)]">
              <span className="flex items-center gap-2">
                <MapPin className="size-4 lg:size-5 tv:size-8" />
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
