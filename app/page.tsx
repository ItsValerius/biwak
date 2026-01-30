import { EventBoard } from "@/components/event-board";
import { getEventWithSlots } from "@/lib/event";


export default async function Home() {
  const initialData = await getEventWithSlots(undefined);

  return (
    <main className="min-h-screen bg-background">
      <EventBoard initialData={initialData} />
    </main>
  );
}
