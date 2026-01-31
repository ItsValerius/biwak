import { Skeleton } from "@/components/ui/skeleton";

export function AdminHeaderSkeleton() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Skeleton className="h-6 w-28 shrink-0" />
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
        <Skeleton className="h-8 w-32 shrink-0" />
        <Skeleton className="h-8 w-28 shrink-0" />
      </div>
    </div>
  );
}
