// app/(authGroup)/_components/RegisterForm.tsx
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Tent,
  Store,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Wallet,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerAction } from '../_actions/authActions';
import { VerifyOtpForm } from '../_components/VerifyOtpForm';
import { toast } from 'sonner';

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

const roleOptions = [
  {
    value: 'CUSTOMER' as const,
    icon: Tent,
    title: 'Rent gear',
    description: 'Browse and book tents, bikes, kayaks and more by the day.',
  },
  {
    value: 'PROVIDER' as const,
    icon: Store,
    title: 'List my gear',
    description: 'Earn from equipment sitting unused. You set the price and stock.',
  },
];

const sidePanelFeatures = [
  { icon: ShieldCheck, text: 'Verified providers, tracked rental history' },
  { icon: Wallet, text: 'Secure payments — card details never touch our servers' },
  { icon: Star, text: 'Reviews only from renters who actually completed a rental' },
];

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<{ email: string; devOtp?: string } | null>(null);

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

  if (pendingEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <VerifyOtpForm email={pendingEmail.email} initialDevOtp={pendingEmail.devOtp} />
        </div>
      </div>
    );
  }

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

      toast.success('Verification code sent. Check your email.');
      // The account is created only after the emailed code is confirmed.
      setPendingEmail({ email: result.data.email, devOtp: result.data.devOtp });
    });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-5">
      {/* Left — brand panel, hidden below lg */}
      <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:col-span-2 lg:flex lg:flex-col lg:justify-between lg:p-10">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
          viewBox="0 0 800 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse
              key={i}
              cx={560 - i * 15}
              cy={180 + i * 14}
              rx={280 - i * 34}
              ry={220 - i * 28}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        <div className="relative">
          <Link href="/" className="flex items-center gap-2">
            <Tent className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold">GearUp</span>
          </Link>

          <h1 className="mt-16 text-3xl font-bold leading-tight xl:text-4xl">
            Join the outdoor
            <br />
            rental community.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/70">
            Whether you are heading out on your next trip or have gear sitting
            idle, GearUp connects renters and providers in one place.
          </p>
        </div>

        <ul className="relative space-y-4">
          {sidePanelFeatures.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10">
                <Icon className="h-3.5 w-3.5 text-accent" />
              </span>
              <span className="text-sm text-primary-foreground/80">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:col-span-3 lg:px-16">
        <div className="w-full max-w-md">
          {/* Mobile-only brand mark */}
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <Tent className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">GearUp</span>
          </Link>

          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Free to join. Takes less than a minute.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {serverError && (
              <p
                role="alert"
                className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                {serverError}
              </p>
            )}

            {/* Role selection */}
            <div className="space-y-2">
              <Label>I want to</Label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map(({ value, icon: Icon, title, description }) => {
                  const isSelected = selectedRole === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue('role', value, { shouldValidate: true })}
                      aria-pressed={isSelected}
                      className={`group relative rounded-lg border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-input hover:border-primary/40 hover:bg-muted/50'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <p
                        className={`mt-2 text-sm font-semibold ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                        {description}
                      </p>
                      {isSelected && (
                        <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
            </div>

            {/* Name + phone side by side on larger screens */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Jane Doe" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" placeholder="+8801700000000" {...register('phone')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="jane@example.com" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="pr-9"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="pr-9"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}