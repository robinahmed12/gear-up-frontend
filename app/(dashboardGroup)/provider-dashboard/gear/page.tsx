// Renders <MyGearList/>

// app/(dashboardGroup)/provider-dashboard/gear/page.tsx
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getProviderGear } from '@/service/getProviderGear';
import { MyGearList } from '../../_components/provider/MyGearList';
import { Button } from '@/components/ui/button';

export default async function ProviderDashboardGearPage() {
  const result = await getProviderGear();
  const gear = result.success ? result.data : [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My gear</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {gear.length} item{gear.length === 1 ? '' : 's'} listed
          </p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/provider-dashboard/gear/new">
            <Plus className="h-4 w-4" />
            Add gear
          </Link>
        </Button>
      </div>

      <MyGearList gear={gear} />
    </div>
  );
}