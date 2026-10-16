// app/(dashboardGroup)/dashboard/profile/page.tsx
import { redirect } from 'next/navigation';
import { getMe } from '@/service/getMe';
import { ProfileForm } from '../../_components/customer/ProfileForm';
import { ChangePasswordForm } from '../../_components/customer/ChangePasswordForm';
import { Mail, Phone, Calendar } from 'lucide-react';

export default async function DashboardgroupDashboardProfilePage() {
  const result = await getMe();

  if (!result.success) {
    redirect('/login');
  }

  const user = result.data;

  const getInitials = (name: string) =>
    (name || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '?';

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Profile header card */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground border-4 border-card shadow-md">
              {getInitials(user.name)}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
              {(user.role || '').toLowerCase()}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">{user.phone || 'Not set'}</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3.5 py-2.5">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground">
                Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal information */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">Personal Information</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Update your name and contact details.</p>
        </div>
        <div className="p-6">
          <ProfileForm user={user} />
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-foreground">Security</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Change your account password.</p>
        </div>
        <div className="p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
