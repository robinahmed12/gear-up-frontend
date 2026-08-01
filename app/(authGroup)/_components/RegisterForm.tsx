// Client Component — React Hook Form + Zod (lib/validation.ts registerSchema), role radio/select (CUSTOMER/PROVIDER), submits via useActionState(registerAction)

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerAction } from '../_actions/authActions';

const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().toLowerCase().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum(['CUSTOMER', 'PROVIDER'], {
      errorMap: () => ({ message: 'Select whether you want to rent or list gear' }),
    }),
    phone: z.string().trim().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER' },
  });

  const selectedRole = watch('role');

  const onSubmit = (values: RegisterFormValues) => {
    setServerError(null);

    startTransition(async () => {
      const result = await registerAction({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone,
      });

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      const destination =
        result.data.user.role === 'PROVIDER'
          ? '/provider-dashboard'
          : result.data.user.role === 'ADMIN'
            ? '/admin-dashboard'
            : '/dashboard';

      router.push(destination);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{serverError}</p>
      )}

      {/* Role selection */}
      <div className="space-y-2">
        <Label>I want to</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('role', 'CUSTOMER')}
            className={`rounded-md border p-3 text-sm font-medium transition-colors ${
              selectedRole === 'CUSTOMER'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-input text-muted-foreground hover:bg-accent'
            }`}
          >
            Rent gear
          </button>
          <button
            type="button"
            onClick={() => setValue('role', 'PROVIDER')}
            className={`rounded-md border p-3 text-sm font-medium transition-colors ${
              selectedRole === 'PROVIDER'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-input text-muted-foreground hover:bg-accent'
            }`}
          >
            List my gear
          </button>
        </div>
        {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" placeholder="Jane Doe" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="jane@example.com" {...register('email')} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" placeholder="+8801700000000" {...register('phone')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register('password')} />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}