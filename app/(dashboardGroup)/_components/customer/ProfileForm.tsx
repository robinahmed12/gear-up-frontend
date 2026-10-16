// app/(dashboardGroup)/_components/ProfileForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { updateProfileSchema, type UpdateProfileValues } from '@/lib/validation';
import type { User } from '@/lib/types';
import { updateProfileAction } from '../../_actions/profileActions';

const errorRing = 'border-destructive focus-visible:ring-destructive/40';

function initials(name: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function humanize(value: string) {
  const text = value.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

function IconInputWrap({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      {children}
    </div>
  );
}

export function ProfileForm({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name, phone: user.phone ?? '' },
  });

  const liveName = watch('name') || user.name;

  const onSubmit = (values: UpdateProfileValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await updateProfileAction(values);
      if (!result.success) {
        setServerError(result.message);
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      // Make the saved values the new baseline so "Save changes" disables again.
      reset(values);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto w-full max-w-2xl space-y-6">
      {/* Identity header */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 sm:p-6">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground"
          aria-hidden
        >
          {initials(liveName)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-foreground">{liveName}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {humanize(String(user.role))}
          </span>
        </div>
      </div>

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>{serverError}</p>
        </div>
      )}

      {/* Personal info */}
      <section className="rounded-xl border border-border bg-card">
        <header className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-foreground">Personal information</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            This is how you appear to providers and customers.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <IconInputWrap icon={UserIcon}>
              <Input
                id="name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={cn('pl-9', errors.name && errorRing)}
                {...register('name')}
              />
            </IconInputWrap>
            <FieldError id="name-error" message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <IconInputWrap icon={Phone}>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+8801700000000"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
                className={cn('pl-9', errors.phone && errorRing)}
                {...register('phone')}
              />
            </IconInputWrap>
            {errors.phone ? (
              <FieldError id="phone-error" message={errors.phone.message} />
            ) : (
              <p id="phone-hint" className="text-xs text-muted-foreground">
                Include your country code.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Account (read-only) */}
      <section className="rounded-xl border border-border bg-card">
        <header className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-foreground">Account</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            These details are locked to your account.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <IconInputWrap icon={Mail}>
              <Input
                id="email"
                value={user.email}
                readOnly
                disabled
                className="bg-muted pl-9 text-muted-foreground"
              />
            </IconInputWrap>
            <p className="text-xs text-muted-foreground">Email can&apos;t be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <IconInputWrap icon={Lock}>
              <Input
                id="role"
                value={humanize(String(user.role))}
                readOnly
                disabled
                className="bg-muted pl-9 text-muted-foreground"
              />
            </IconInputWrap>
            <p className="text-xs text-muted-foreground">Contact support to change your role.</p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        {isDirty && !isPending && (
          <p className="text-sm text-muted-foreground sm:mr-auto" aria-live="polite">
            You have unsaved changes.
          </p>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={isPending || !isDirty}
          onClick={() => {
            reset();
            setServerError(null);
          }}
          className="sm:min-w-28"
        >
          Discard
        </Button>
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="bg-accent text-accent-foreground hover:bg-accent/90 sm:min-w-36"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </form>
  );
}