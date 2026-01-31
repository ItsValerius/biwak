import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Event = {
  name: string;
  location: string;
};

export function AdminEventHeader({ event }: { event: Event }) {
  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {event.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="size-4 shrink-0" aria-hidden />
          {event.location}
        </p>
      </CardContent>
    </Card>
  );
}
