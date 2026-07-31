'use client';

// Global top-level error fallback

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6">
      <p className="text-sm text-destructive">Something went wrong.</p>
      <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
      <button onClick={() => reset()} className="mt-3 text-sm underline">
        Try again
      </button>
    </div>
  );
}
