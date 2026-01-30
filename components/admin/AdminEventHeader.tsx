import { Card, CardHeader, CardTitle } from "@/components/ui/card";

type Event = {
  name: string;
  location: string;
};

export function AdminEventHeader({ event }: { event: Event }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{event.name}</CardTitle>
        <p className="text-muted-foreground">{event.location}</p>
      </CardHeader>
    </Card>
  );
}
