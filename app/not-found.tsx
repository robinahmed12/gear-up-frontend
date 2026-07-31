// Global 404 page — proxy.ts redirects unauthorized role access here

export default function RootNotFound() {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">404 — Not Found</h1>
      <p className="text-sm text-muted-foreground">This page doesn&apos;t exist.</p>
    </div>
  );
}
