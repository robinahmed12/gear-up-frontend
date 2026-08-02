// Renders <UserTable/>. Consumes service/getAdminUsers.ts
import { getAdminUsers } from "@/service/getAdminUsers";
import UserTable from "../../_components/admin/UserTable";

export default async function AdminDashboardUsersPage() {
  const response = await getAdminUsers();
  console.log(response, "res")

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <p className="text-muted-foreground">
          Search, suspend and activate users.
        </p>
      </div>

      <UserTable
        initialData={response.data ?? []}
      />

    </div>
  );
}