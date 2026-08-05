// app/loading.tsx
import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner */}
        <div className="rounded-full border border-border bg-card p-5 shadow-lg">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>

        {/* Brand */}
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-bold tracking-tight">
            GearUp
          </h2>

          <p className="text-sm text-muted-foreground">
            Loading your experience...
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}