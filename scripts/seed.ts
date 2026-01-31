import "dotenv/config";
import { createEvent, createSlots } from "../lib/event";

async function seed() {
  const eventResult = await createEvent({
    name: "Karneval Biwak 2025",
    location: "Hauptbühne",
  });

  if (eventResult.error || !eventResult.id) {
    throw new Error(eventResult.error ?? "Failed to create event");
  }

  const now = new Date();
  const slots = [
    { clubName: "Club Rot-Weiss", plannedStart: new Date(now.getTime()).toISOString() },
    { clubName: "Närrische Garde", plannedStart: new Date(now.getTime() + 15 * 60 * 1000).toISOString() },
    { clubName: "Tanzgruppe Blau", plannedStart: new Date(now.getTime() + 30 * 60 * 1000).toISOString() },
    { clubName: "Musikverein Grün", plannedStart: new Date(now.getTime() + 45 * 60 * 1000).toISOString() },
    { clubName: "Jugendclub Gelb", plannedStart: new Date(now.getTime() + 60 * 60 * 1000).toISOString() },
  ];

  const slotsResult = await createSlots(eventResult.id, slots);
  if (slotsResult.error) {
    throw new Error(slotsResult.error);
  }

  console.log("Seed complete. Event ID:", eventResult.id);
}

seed().catch(console.error).finally(process.exit);
