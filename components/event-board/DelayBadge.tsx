import { Badge } from "@/components/ui/badge";

type DelayBadgeProps = {
  label: string;
  variant: "behind" | "ahead";
};

const variantStyles = {
  behind: "bg-orange-500 text-white",
  ahead: "bg-blue-600 text-white",
} as const;

export function DelayBadge({ label, variant }: DelayBadgeProps) {
  return (
    <Badge
      className={`border-0 px-3 py-1 text-sm font-bold lg:px-4 lg:text-base tv:px-5 tv:py-2 tv:text-[clamp(1rem,1.5vw,1.5rem)] ${variantStyles[variant]}`}
    >
      {label}
    </Badge>
  );
}
