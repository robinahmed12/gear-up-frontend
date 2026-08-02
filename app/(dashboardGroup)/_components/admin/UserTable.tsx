"use client";

import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAdminUsersQuery } from "@/hooks/use-admin-users-query";

import { User } from "@/lib/types";
import { activateUserAction, suspendUserAction } from "../../_actions/adminActions";

interface UserTableProps {
  initialData: User[];
}
export default function UserTable({ initialData }: UserTableProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pending, startTransition] = useTransition();

  const { data, isLoading } = useAdminUsersQuery(search, page);

  // Use query data if available, otherwise fallback to initialData
  const users = data?.data ?? initialData;

  async function updateStatus(id: string, active: boolean) {
    startTransition(async () => {
      const result = active
        ? await suspendUserAction(id)
        : await activateUserAction(id);

      if (result.success) {
        toast.success("User updated");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      } else {
        toast.error(result.message);
      }
    });
  }

  if (isLoading && users.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <Input
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{user.status}</td>
                <td className="p-4">
                  <Button
                    disabled={pending}
                    size="sm"
                    variant={user.status === "ACTIVE" ? "destructive" : "default"}
                    onClick={() => updateStatus(user.id, user.status === "ACTIVE")}
                  >
                    {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
