export function EventBoardFooter({ lastUpdated }: { lastUpdated: number }) {
  return (
    <div className="py-2 text-center text-sm text-muted-foreground lg:py-4 lg:text-base tv:py-6 tv:text-[clamp(1rem,1.5vw,1.5rem)]">
      Zuletzt aktualisiert: vor {lastUpdated} Sekunden
    </div>
  );
}
