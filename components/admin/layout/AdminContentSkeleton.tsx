import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AdminContentSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="min-w-0 border-primary/20 shadow-sm">
        <CardHeader className="flex-row items-start justify-between gap-2 pb-2">
          <CardTitle>
            <Skeleton className="h-8 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton className="h-4 w-64" />
        </CardContent>
      </Card>
      <Skeleton className="h-14 w-full rounded-lg md:h-16 shrink-0" />
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-56" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full max-w-md" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg shrink-0" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
