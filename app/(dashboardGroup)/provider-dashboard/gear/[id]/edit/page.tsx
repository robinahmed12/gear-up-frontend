// app/(dashboardGroup)/provider-dashboard/gear/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import { getGearById } from '@/app/(publicGroup)/_actions/getGearById';
import { getCategories } from '@/app/(publicGroup)/_actions/getCategories';
import { GearFormDialog } from '../../../../_components/provider/GearFormDialog';

interface EditGearPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardgroupProviderDashboardGearByIdEditPage({
  params,
}: EditGearPageProps) {
  const { id } = await params;

  const [gearResponse, categoryResponse] = await Promise.all([
    getGearById(id),
    getCategories(),
  ]);

  if (!gearResponse.success || !gearResponse.data) {
    notFound();
  }

  const gear = gearResponse.data;
  const categories = categoryResponse?.data ?? [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit gear</h1>
        <p className="mt-1 text-sm text-muted-foreground">{gear.title}</p>
      </div>

      <GearFormDialog mode="edit" categories={categories} gear={gear} />
    </div>
  );
}