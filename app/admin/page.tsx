import { redirect } from "next/navigation";
import Link from "next/link";
import { hasAdminSession } from "@/lib/auth";
import { getEventWithSlots, listEvents, getActiveEventId } from "@/lib/event";
import {
  AdminLayout,
  AdminAddSlotsDialog,
  AdminEventSelect,
  AdminSetActiveEventButton,
  AdminCreateEventForm,
  AdminEventHeader,
  AdminScheduleForm,
  AdminImportCsv,
} from "@/components/admin";
import { AdminDashboard } from "@/app/admin/admin-dashboard";
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
      <AdminLayout
        header={
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">Verwaltung</h1>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">Abbrechen</Link>
            </Button>
          </div>
        }
      >
        <AdminCreateEventForm
          title="Neues Event erstellen"
          description="Name und Ort für das neue Event eingeben."
        />
      </AdminLayout>
    );
  }

  const data = await getEventWithSlots(params.eventId ?? undefined);

  if (!data) {
    const eventList = await listEvents();
    if (eventList.length > 0) {
      redirect(`/admin?eventId=${eventList[0]!.id}`);
    }
    return (
      <AdminLayout
        header={
          <div className="mx-auto max-w-4xl">
            <h1 className="text-lg font-semibold tracking-tight">Verwaltung</h1>
          </div>
        }
        mainClassName="flex flex-col items-center justify-center gap-8"
      >
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
      </AdminLayout>
    );
  }

  const eventList = await listEvents();
  const currentEventId = data.event.id;
  const activeEventId = await getActiveEventId();

  return (
    <AdminLayout
      stickyHeader
      header={
        <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="shrink-0 text-lg font-semibold tracking-tight">
              Verwaltung
            </h1>
            {eventList.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-muted-foreground text-sm">
                  Event
                </span>
                <AdminEventSelect
                  events={eventList}
                  currentEventId={currentEventId}
                  activeEventId={activeEventId}
                />
              </div>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-t pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
            <AdminSetActiveEventButton
              eventId={currentEventId}
              isActive={currentEventId === activeEventId}
            />
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin?create=1">+ Event erstellen</Link>
            </Button>
            {data.slots.length > 0 && (
              <AdminAddSlotsDialog eventId={data.event.id} />
            )}
          </div>
        </div>
      }
    >
      {data.slots.length === 0 ? (
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
      ) : (
        <AdminDashboard event={data.event} slots={data.slots} />
      )}
    </AdminLayout>
  );
}
