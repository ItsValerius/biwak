"use client";

import { useEffect, useState } from "react";
import {
  getCurrentSlot,
  getNextSlots,
  getScheduleDeviationBadge,
  type GetEventResponse,
  type EventWithSlots,
} from "@/lib/event/client";
import { EVENT_STATUS } from "@/lib/constants";
import { fetchEvent } from "@/lib/api";
import { EventBoardEmptyState } from "./EventBoardEmptyState";
import { EventBoardHeader } from "./EventBoardHeader";
import { EventBoardNowOnStage } from "./EventBoardNowOnStage";
import { EventBoardUpNext } from "./EventBoardUpNext";
import { EventBoardFooter } from "./EventBoardFooter";

const POLL_INTERVAL_MS = 10_000;
const NEXT_SLOTS_COUNT = 2;

const ERROR_NO_EVENT = "Kein Event.";
const ERROR_LOAD_FAILED = "Fehler beim Laden.";
const LOADING_LABEL = "Laden…";

type EventBoardProps = {
  /** Initial data from Server Component; avoids loading state on first paint. */
  initialData?: EventWithSlots | null;
};

export function EventBoard({ initialData }: EventBoardProps) {
  const [boardData, setBoardData] = useState<GetEventResponse | null>(
    initialData ?? null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialData === null ? ERROR_NO_EVENT : null
  );
  const [lastUpdated, setLastUpdated] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    async function load() {
      const result = await fetchEvent();
      if (result.ok) {
        setBoardData(result.data);
        setErrorMessage(null);
        setLastUpdated(0);
      } else {
        setErrorMessage(
          result.status === 404 ? ERROR_NO_EVENT : ERROR_LOAD_FAILED
        );
      }
    }
    load();
    const intervalId = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastUpdated((prev) => prev + 1);
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (errorMessage && !boardData) {
    if (errorMessage === ERROR_NO_EVENT) {
      return (
        <EventBoardEmptyState
          variant="no-event"
          description="Aktuell läuft noch kein Live-Programm. Am 01.02.2026 um 10:11 Uhr geht es los."
        />
      );
    }
    return <EventBoardEmptyState variant="error" message={errorMessage} />;
  }

  if (!boardData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-muted-foreground text-[clamp(1rem,2vw,2.5rem)]">
          {LOADING_LABEL}
        </p>
      </div>
    );
  }

  const { event, slots } = boardData;
  const currentSlot = getCurrentSlot(slots, event.currentSlotId);
  const nextSlots = getNextSlots(slots, event.currentSlotId, NEXT_SLOTS_COUNT);
  const isPaused = event.status === EVENT_STATUS.PAUSE_UMBAU;
  const nextSlot = nextSlots[0];
  const scheduleDeviationBadge = getScheduleDeviationBadge(
    currentSlot,
    nextSlot ?? null,
    currentTime
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-md flex-col gap-5 px-4 py-6 lg:max-w-4xl lg:gap-8 lg:py-10 xl:max-w-6xl tv:max-w-360 tv:gap-12 tv:px-16 tv:py-14">
        <EventBoardHeader event={event} />
        <EventBoardNowOnStage
          isPaused={isPaused}
          currentSlot={currentSlot}
        />
        <EventBoardUpNext
          slots={nextSlots}
          scheduleDeviationBadge={scheduleDeviationBadge}
        />
        <EventBoardFooter lastUpdated={lastUpdated} />
      </div>
    </div>
  );
}
