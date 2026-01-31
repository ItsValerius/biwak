import { redirect } from "next/navigation";
import { listEvents } from "@/lib/event";
import { getCachedEventWithSlots } from "@/lib/event/cache";
import {
  AdminEventHeader,
  AdminScheduleForm,
  AdminImportCsv,
  AdminCreateEventForm,
} from "@/components/admin";
import { AdminDashboard } from "@/app/admin/admin-dashboard";

type AdminEventContentProps = {
  eventId: string | undefined;
};

export async function AdminEventContent({ eventId }: AdminEventContentProps) {
  const data = await getCachedEventWithSlots(eventId);

  if (!data) {
    const eventList = await listEvents();
    if (eventList.length > 0) {
      redirect(`/admin?eventId=${eventList[0]!.id}`);
    }
    return (
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex max-w-md flex-col items-center gap-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Dein erstes Event erstellen
            </h2>
            <p className="text-muted-foreground text-sm">
              Lege Name und Ort fest, danach kannst du das Programm planen.
            </p>
          </div>
          <AdminCreateEventForm
            title="Event erstellen"
            description="Name und Ort für das neue Event eingeben."
          />
        </div>
      </div>
    );
  }

  if (data.slots.length === 0) {
    return (
      <div className="space-y-8">
        <AdminEventHeader event={data.event} />
        <AdminScheduleForm
          eventId={data.event.id}
          title="Programm hinzufügen"
          description="Slots mit Club-Name und geplanter Startzeit anlegen."
        />
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-2 text-sm font-medium">Oder aus CSV importieren</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            CSV mit Spalten <code className="rounded bg-muted px-1">name</code>{" "}
            und <code className="rounded bg-muted px-1">time</code> (z. B.
            14:00 oder 14:00:00).
          </p>
          <AdminImportCsv eventId={data.event.id} />
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard event={data.event} slots={data.slots} />
  );
}
