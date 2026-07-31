// Home page — featured gear. Server Component, calls _actions/getGearList.ts directly (no client fetch needed for initial render)

export default function PublicgroupPage() {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">publicGroup — page</h1>
      <p className="text-sm text-muted-foreground">
        Placeholder — see the comment above this component for what belongs here.
      </p>
    </div>
  );
}
