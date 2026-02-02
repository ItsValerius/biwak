import { EventBoard } from "@/features/event-board";
import { getEventWithSlots } from "@/features/events";


export default async function Home() {
  const initialData = await getEventWithSlots(undefined);

  return (
    <main className="min-h-screen bg-background">
      <EventBoard initialData={initialData} />
    </main>
  );
}
