import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { hasAdminSession } from "@/lib/auth";
import {
  AdminLayout,
  AdminCreateEventForm,
  AdminHeaderSkeleton,
  AdminContentSkeleton,
} from "@/components/admin";
import { AdminHeaderMeta } from "@/components/admin/layout/AdminHeaderMeta";
import { AdminEventContent } from "@/components/admin/events/AdminEventContent";
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

  return (
    <AdminLayout
      stickyHeader
      header={
        <Suspense fallback={<AdminHeaderSkeleton />}>
          <AdminHeaderMeta eventId={params.eventId} />
        </Suspense>
      }
    >
      <Suspense fallback={<AdminContentSkeleton />}>
        <AdminEventContent eventId={params.eventId} />
      </Suspense>
    </AdminLayout>
  );
}
