// app/(authGroup)/_components/LoginForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tent, Eye, EyeOff, Loader2, PackageCheck, Star, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '../_actions/authActions';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const sidePanelFeatures = [
  { icon: PackageCheck, text: 'Track every rental from booking to return' },
  { icon: Star, text: 'Leave reviews once your gear is back' },
  { icon: MapPin, text: 'Pick up locally — no shipping wait' },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    setServerError(null);

    startTransition(async () => {
      const result = await loginAction(values);

      if (result.success) {
        toast.success(`Login  successfully as ${result.data.user.role} `)
      }

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
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
            Welcome back.
            <br />
            Your next trip is one login away.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/70">
            Pick up where you left off — check your bookings, message a
            provider, or list something new.
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

          <h2 className="text-2xl font-bold tracking-tight text-foreground">Log in</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Welcome back — enter your details to continue.
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

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
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

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}