import { Badge } from "@/components/ui/badge";

export function DelayBadge({ label }: { label: string }) {
  return (
    <Badge className="border-0 bg-orange-500 px-3 py-1 text-sm font-bold text-white lg:px-4 lg:text-base tv:px-5 tv:py-2 tv:text-[clamp(1rem,1.5vw,1.5rem)]">
      {label}
    </Badge>
  );
}
