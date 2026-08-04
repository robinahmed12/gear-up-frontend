// app/(dashboardGroup)/_components/ProfileForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfileSchema, type UpdateProfileValues } from '@/lib/validation';
import type { User } from '@/lib/types';
import { updateProfileAction } from '../../_actions/profileActions';

export function ProfileForm({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name, phone: user.phone ?? '' },
  });

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
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <p
          role="alert"
          className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}

      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={user.email} disabled className="bg-muted text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Email can&apos;t be changed.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+8801700000000" {...register('phone')} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {user.role}
          </span>
          <span className="text-xs text-muted-foreground">Contact support to change your role.</span>
        </div>
      </div>

      <Button type="submit" disabled={isPending || !isDirty} className="w-full sm:w-auto">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save changes'
        )}
      </Button>
    </form>
  );
}