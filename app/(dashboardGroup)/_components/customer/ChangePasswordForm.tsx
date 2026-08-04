// app/(dashboardGroup)/_components/ChangePasswordForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePasswordSchema, type ChangePasswordValues } from '@/lib/validation';
import { changePasswordAction } from '../../_actions/profileActions';

function PasswordField({
  id,
  label,
  register,
  error,
}: {
  id: keyof ChangePasswordValues;
  label: string;
  register: ReturnType<typeof useForm<ChangePasswordValues>>['register'];
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input id={id} type={show ? 'text' : 'password'} className="pr-9" {...register(id)} />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (values: ChangePasswordValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await changePasswordAction(values);
      if (!result.success) {
        setServerError(result.message);
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      reset();
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

      <PasswordField
        id="currentPassword"
        label="Current password"
        register={register}
        error={errors.currentPassword?.message}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PasswordField
          id="newPassword"
          label="New password"
          register={register}
          error={errors.newPassword?.message}
        />
        <PasswordField
          id="confirmNewPassword"
          label="Confirm new password"
          register={register}
          error={errors.confirmNewPassword?.message}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          'Change password'
        )}
      </Button>
    </form>
  );
}