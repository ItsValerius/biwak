import "dotenv/config";
import { db } from "../lib/db/index";
import { events, scheduleSlots } from "../lib/db/schema";

async function seed() {
  const [event] = await db
    .insert(events)
    .values({
      name: "Karneval Biwak 2025",
      location: "Hauptbühne",
      status: "running",
    })
    .returning();

  if (!event) {
    throw new Error("Failed to create event");
  }

  const now = new Date();
  const slots = [
    { clubName: "Club Rot-Weiss", plannedStart: new Date(now.getTime()), orderIndex: 0 },
    { clubName: "Närrische Garde", plannedStart: new Date(now.getTime() + 15 * 60 * 1000), orderIndex: 1 },
    { clubName: "Tanzgruppe Blau", plannedStart: new Date(now.getTime() + 30 * 60 * 1000), orderIndex: 2 },
    { clubName: "Musikverein Grün", plannedStart: new Date(now.getTime() + 45 * 60 * 1000), orderIndex: 3 },
    { clubName: "Jugendclub Gelb", plannedStart: new Date(now.getTime() + 60 * 60 * 1000), orderIndex: 4 },
  ];

  await db.insert(scheduleSlots).values(
    slots.map((s) => ({
      eventId: event.id,
      clubName: s.clubName,
      plannedStart: s.plannedStart,
      orderIndex: s.orderIndex,
    }))
  );

  console.log("Seed complete. Event ID:", event.id);
}

seed().catch(console.error).finally(process.exit);
