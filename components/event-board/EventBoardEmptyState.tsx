"use client";

import Image from "next/image";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type EventBoardEmptyStateProps =
  | {
      variant: "no-event";
      description?: string;
    }
  | {
      variant: "error";
      message: string;
    };

export function EventBoardEmptyState(props: EventBoardEmptyStateProps) {
  if (props.variant === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-muted-foreground text-[clamp(1rem,2vw,2.5rem)]">
          {props.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Empty className="max-w-md border-0 p-0">
        <EmptyHeader className="max-w-md gap-6 lg:gap-8">
          <EmptyMedia variant="default" className="mb-0">
            <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm lg:size-32">
              <Image
                src="/logo.png"
                alt="KG Knallköpp Golkrath"
                fill
                className="object-contain p-3"
              />
            </div>
          </EmptyMedia>
          <EmptyTitle className="text-2xl font-bold lg:text-3xl">
            Biwak – KG Knallköpp Golkrath
          </EmptyTitle>
          <EmptyDescription className="text-base leading-relaxed lg:text-lg">
            {props.description ??
              "Aktuell läuft noch kein Live-Programm. Schau bald wieder vorbei – wir melden uns, wenn der nächste Biwak ansteht."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <p className="text-xs text-muted-foreground/80">Knall Mött!</p>
        </EmptyContent>
      </Empty>
    </div>
  );
}
