"use client";

import { useEffect, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, Search, UserX, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAdminUsersQuery } from "@/hooks/use-admin-users-query";

import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import { activateUserAction, suspendUserAction } from "../../_actions/adminActions";

interface UserTableProps {
  initialData: User[];
}

/* ---------- helpers ---------- */

function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function initials(name?: string | null) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (parts[0][0] + last).toUpperCase();
}

function humanize(value?: string | null) {
  if (!value) return "—";
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const STATUS_STYLE: Record<string, { badge: string; dot: string }> = {
  ACTIVE: { badge: "bg-primary/15 text-primary", dot: "bg-primary" },
  SUSPENDED: { badge: "bg-destructive/15 text-destructive", dot: "bg-destructive" },
  BANNED: { badge: "bg-destructive/15 text-destructive", dot: "bg-destructive" },
  PENDING: { badge: "bg-accent/15 text-accent", dot: "bg-accent" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? {
    badge: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        s.badge,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden />
      {humanize(status)}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      {humanize(role)}
    </span>
  );
}

function Avatar({ name, size = "h-10 w-10" }: { name?: string | null; size?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary",
        size,
      )}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}

/* ---------- component ---------- */

export default function UserTable({ initialData }: UserTableProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // Debounce so we don't fire a request on every keystroke.
  const debouncedSearch = useDebounced(search);
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isFetching } = useAdminUsersQuery(debouncedSearch, page);

  // Use query data if available, otherwise fall back to initialData
  const users: User[] = data?.data ?? initialData;

  // If your API returns pagination meta, the Next button will use it.
  const totalPages: number | undefined =
    (data as any)?.meta?.totalPages ?? (data as any)?.totalPages;
  const isLastPage = totalPages ? page >= totalPages : users.length === 0;

  function runStatusChange(user: User) {
    const isActive = user.status === "ACTIVE";
    setActiveRowId(user.id);
    startTransition(async () => {
      try {
        const result = isActive
          ? await suspendUserAction(user.id)
          : await activateUserAction(user.id);

        if (result.success) {
          toast.success(isActive ? "User suspended" : "User activated");
          queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        } else {
          toast.error(result.message);
        }
      } finally {
        setActiveRowId(null);
      }
    });
  }

  function handleStatusClick(user: User) {
    if (user.status === "ACTIVE") {
      toast.warning(`Suspend ${user.name}?`, {
        description: "They won't be able to sign in until you activate them again.",
        action: { label: "Suspend", onClick: () => runStatusChange(user) },
        cancel: { label: "Cancel", onClick: () => {} },
      });
    } else {
      runStatusChange(user);
    }
  }

  function StatusButton({ user, fullWidth = false }: { user: User; fullWidth?: boolean }) {
    const isActive = user.status === "ACTIVE";
    const isThisRow = pending && activeRowId === user.id;
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => handleStatusClick(user)}
        className={cn(
          fullWidth && "w-full",
          isActive
            ? "border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            : "border-primary/30 text-primary hover:bg-primary/10 hover:text-primary",
        )}
      >
        {isThisRow ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isActive ? (
          "Suspend"
        ) : (
          "Activate"
        )}
      </Button>
    );
  }

  const showSkeleton = isLoading && users.length === 0;

  return (
    <section className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search by name or email"
            aria-label="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
          {isFetching && !showSkeleton && (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          )}
          {users.length} {users.length === 1 ? "user" : "users"} on this page
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {showSkeleton ? (
          <div aria-busy="true" aria-label="Loading users" className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                </div>
                <div className="hidden h-6 w-20 animate-pulse rounded-full bg-muted sm:block" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              <UserX className="h-6 w-6" aria-hidden />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">No users found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search ? "Try a different name or email." : "There are no users on this page."}
            </p>
            {search && (
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setSearch("")}>
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">User</th>
                    <th scope="col" className="px-5 py-3 font-medium">Role</th>
                    <th scope="col" className="px-5 py-3 font-medium">Status</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className={cn(
                        "transition-colors hover:bg-muted/30",
                        user.status !== "ACTIVE" && "bg-muted/20",
                      )}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <StatusButton user={user} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-border md:hidden">
              {users.map((user) => (
                <li key={user.id} className="space-y-3 p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={user.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <StatusBadge status={user.status} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <RoleBadge role={user.role} />
                    <div className="w-32">
                      <StatusButton user={user} fullWidth />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2.5">
          <p className="text-xs text-muted-foreground tabular-nums">
            Page {page}
            {totalPages ? ` of ${totalPages}` : ""}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isLastPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}