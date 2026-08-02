// Renders <AdminGearTable/>. Consumes service/getAdminGear.ts
import { getAdminGear } from "@/service/getAdminGear";
import AdminGearTable from "../../_components/admin/AdminGearTable";


export default async function DashboardgroupAdminDashboardGearPage() {

  const response = await getAdminGear();

  const gears = response.data ?? [];


  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Gear Moderation
        </h1>

        <p className="text-muted-foreground">
          Review all gear listings from providers.
        </p>
      </div>


      <AdminGearTable gears={gears} />

    </div>
  );
}