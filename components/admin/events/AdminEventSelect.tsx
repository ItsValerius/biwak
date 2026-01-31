"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Event = { id: string; name: string };

type AdminEventSelectProps = {
  events: Event[];
  currentEventId: string;
  activeEventId: string | null;
  className?: string;
};

export function AdminEventSelect({
  events,
  currentEventId,
  activeEventId,
  className,
}: AdminEventSelectProps) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    if (id) router.push(`/admin?eventId=${id}`);
  }

  if (events.length <= 1) return null;

  return (
    <div className={cn("relative min-w-0 max-w-56", className)}>
      <select
        value={currentEventId}
        onChange={handleChange}
        aria-label="Event wechseln"
        className="h-8 w-full appearance-none rounded-md border border-input bg-background px-3 py-1.5 pr-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {events.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
            {e.id === activeEventId ? " (Live)" : ""}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}
