// Renders <GearFormDialog mode='create'/>

// app/(dashboardGroup)/provider-dashboard/gear/new/page.tsx
import { getCategories } from '@/app/(publicGroup)/_actions/getCategories';
import { GearFormDialog } from '../../../_components/provider/GearFormDialog';

export default async function ProviderDashboardGearNewPage() {
  const categoryResponse = await getCategories();
  const categories = categoryResponse?.data ?? [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add gear</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          List a new item for customers to rent.
        </p>
      </div>

      <GearFormDialog mode="create" categories={categories} />
    </div>
  );
}
