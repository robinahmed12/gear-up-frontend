'use client';

import { useEffect, useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  resendRegistrationOtpAction,
  verifyRegistrationOtpAction,
} from '../_actions/authActions';

function destinationForRole(role: string): string {
  if (role === 'PROVIDER') return '/provider-dashboard';
  if (role === 'ADMIN') return '/admin-dashboard';
  return '/dashboard';
}

/**
 * Second step of registration: the account isn't created until the emailed
 * code is confirmed. On success the account is verified and the user is
 * redirected straight into their dashboard.
 */
export function VerifyOtpForm({
  email,
  initialDevOtp,
}: {
  email: string;
  initialDevOtp?: string;
}) {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | undefined>(initialDevOtp);
  const [serverError, setServerError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = cooldown > 0 ? window.setInterval(() => setCooldown((v) => v - 1), 1000) : undefined;
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [cooldown]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);

    startTransition(async () => {
      const result = await verifyRegistrationOtpAction(email, otp);
      if (!result.success) {
        setServerError(result.message);
        return;
      }
      router.push(destinationForRole(result.data.user.role));
      router.refresh();
    });
  };

  const handleResend = () => {
    setServerError(null);
    startTransition(async () => {
      const result = await resendRegistrationOtpAction(email);
      if (!result.success) {
        setServerError(result.message);
        return;
      }
      if (result.devOtp) setDevOtp(result.devOtp);
      setCooldown(60);
    });
  };

  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <ShieldCheck className="h-7 w-7 text-primary" />
      </span>

      <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">Verify your email</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Enter the 6-digit code we sent to{' '}
        <span className="font-medium text-foreground">{email}</span> to finish creating your account.
      </p>

      <form onSubmit={onSubmit} className="mt-6 w-full max-w-xs space-y-4 text-left">
        {serverError && (
          <p
            role="alert"
            className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            {serverError}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="otp">Verification code</Label>
          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-lg tracking-[0.5em]"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || otp.length !== 6}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify and continue'
          )}
        </Button>

        <button
          type="button"
          onClick={handleResend}
          disabled={isPending || cooldown > 0}
          className="w-full text-center text-sm font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>

        {devOtp && (
          <p className="rounded-md bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
            Dev code: <span className="font-semibold tracking-widest">{devOtp}</span>
          </p>
        )}
      </form>
    </div>
  );
}
