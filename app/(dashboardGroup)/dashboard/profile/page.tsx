// app/(dashboardGroup)/dashboard/profile/page.tsx
import { redirect } from 'next/navigation';
import { getMe } from '@/service/getMe';
import { ProfileForm } from '../../_components/customer/ProfileForm';
import { ChangePasswordForm } from '../../_components/customer/ChangePasswordForm';


export default async function DashboardgroupDashboardProfilePage() {
  const result = await getMe();

  if (!result.success) {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account details and password.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-5 text-sm font-semibold text-foreground">Personal information</h2>
        <ProfileForm user={result.data} />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-5 text-sm font-semibold text-foreground">Change password</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}