import Link from "next/link";
import { Suspense } from "react";
import { listEvents, getActiveEventId } from "@/features/events";
import {
  AdminEventSelect,
  AdminSetActiveEventButton,
} from "../events";
import { AdminAddSlotsDialog } from "../slots";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { getCachedEventWithSlots } from "@/features/events/lib/cache";

type AdminHeaderMetaProps = {
  eventId: string | undefined;
};

export async function AdminHeaderMeta({ eventId }: AdminHeaderMetaProps) {
  const [eventList, activeEventId] = await Promise.all([
    listEvents(),
    getActiveEventId(),
  ]);

  const currentEventId = eventId ?? eventList[0]?.id ?? null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <h1 className="shrink-0 text-lg font-semibold tracking-tight">
          Verwaltung
        </h1>
        {eventList.length > 1 && currentEventId && (
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-muted-foreground text-sm">
              Event
            </span>
            <AdminEventSelect
              events={eventList}
              currentEventId={currentEventId}
              activeEventId={activeEventId}
            />
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-t pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
        {currentEventId && (
          <AdminSetActiveEventButton
            eventId={currentEventId}
            isActive={currentEventId === activeEventId}
          />
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin?create=1">+ Event erstellen</Link>
        </Button>
        {currentEventId && (
          <Suspense fallback={<Skeleton className="h-8 w-28" />}>
            <AdminHeaderAddSlots eventId={currentEventId} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

async function AdminHeaderAddSlots({ eventId }: { eventId: string }) {
  const data = await getCachedEventWithSlots(eventId);
  if (!data || data.slots.length === 0) return null;

  return <AdminAddSlotsDialog eventId={eventId} />;
}
