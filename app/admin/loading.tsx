import { AdminHeaderSkeleton, AdminContentSkeleton } from "@/features/admin";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-card px-4 py-4 shadow-sm md:px-8">
        <AdminHeaderSkeleton />
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <AdminContentSkeleton />
      </main>
    </div>
  );
}
