import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth";
import { getEventWithSlots } from "@/lib/event";
import { AdminDashboard } from "@/app/admin/admin-dashboard";

export const runtime = "nodejs";

export default async function AdminPage() {
  const isAdmin = await hasAdminSession();
  if (!isAdmin) redirect("/admin/login");

  const data = await getEventWithSlots(undefined);
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="text-muted-foreground">Kein Event. Bitte db:seed ausführen.</p>
      </div>
    );
  }

  return <AdminDashboard event={data.event} slots={data.slots} />;
}
