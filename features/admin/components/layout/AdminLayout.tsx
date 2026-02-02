import { cn } from "@/lib/utils";

type AdminLayoutProps = {
  header: React.ReactNode;
  children: React.ReactNode;
  stickyHeader?: boolean;
  mainClassName?: string;
};

export function AdminLayout({
  header,
  children,
  stickyHeader = false,
  mainClassName,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header
        className={cn(
          "border-b bg-card px-4 py-4 shadow-sm md:px-8",
          stickyHeader && "sticky top-0 z-10"
        )}
      >
        {header}
      </header>
      <main
        className={cn(
          "mx-auto max-w-4xl px-4 py-8 md:px-8",
          mainClassName
        )}
      >
        {children}
      </main>
    </div>
  );
}
