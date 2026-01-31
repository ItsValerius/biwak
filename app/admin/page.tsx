import { redirect } from "next/navigation";
import Link from "next/link";
import { hasAdminSession } from "@/lib/auth";
import { getEventWithSlots, listEvents } from "@/lib/event";
import { AdminDashboard } from "@/app/admin/admin-dashboard";
import { AdminAddSlotsDialog } from "@/components/admin/AdminAddSlotsDialog";
import { AdminCreateEventForm } from "@/components/admin/AdminCreateEventForm";
import { AdminEventHeader } from "@/components/admin/AdminEventHeader";
import { AdminScheduleForm } from "@/components/admin/AdminScheduleForm";
import { Button } from "@/components/ui/button";

export const runtime = "nodejs";

type AdminPageProps = {
  searchParams: Promise<{ eventId?: string; create?: string }> | { eventId?: string; create?: string };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const isAdmin = await hasAdminSession();
  if (!isAdmin) redirect("/admin/login");

  const params = await Promise.resolve(searchParams);
  const showCreateForm = params.create === "1";

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="border-b bg-card px-4 py-4 shadow-sm md:px-8">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">Verwaltung</h1>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">Abbrechen</Link>
            </Button>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
          <AdminCreateEventForm
            title="Neues Event erstellen"
            description="Name und Ort für das neue Event eingeben."
          />
        </main>
      </div>
    );
  }

  const data = await getEventWithSlots(params.eventId ?? undefined);

  if (!data) {
    const eventList = await listEvents();
    if (eventList.length > 0) {
      redirect(`/admin?eventId=${eventList[0]!.id}`);
    }
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="border-b bg-card px-4 py-4 shadow-sm md:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-lg font-semibold tracking-tight">Verwaltung</h1>
          </div>
        </header>
        <main className="mx-auto flex max-w-md flex-col items-center justify-center gap-8 px-4 py-12">
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
        </main>
      </div>
    );
  }

  const eventList = await listEvents();
  const currentEventId = data.event.id;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-4 shadow-sm md:px-8">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-3">
          <h1 className="mr-4 text-lg font-semibold tracking-tight">
            Verwaltung
          </h1>
          {eventList.length > 1 && (
            <nav className="flex flex-wrap items-center gap-2" aria-label="Event wechseln">
              <span className="text-muted-foreground text-sm">Event:</span>
              {eventList.map((e) => (
                <Button
                  key={e.id}
                  variant={e.id === currentEventId ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={`/admin?eventId=${e.id}`}>{e.name}</Link>
                </Button>
              ))}
            </nav>
          )}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin?create=1">+ Event erstellen</Link>
            </Button>
            {data.slots.length > 0 && (
              <AdminAddSlotsDialog eventId={data.event.id} />
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
        {data.slots.length === 0 ? (
          <div className="space-y-8">
            <AdminEventHeader event={data.event} />
            <AdminScheduleForm
              eventId={data.event.id}
              title="Programm hinzufügen"
              description="Slots mit Club-Name und geplanter Startzeit anlegen."
            />
          </div>
        ) : (
          <AdminDashboard event={data.event} slots={data.slots} />
        )}
      </main>
    </div>
  );
}
