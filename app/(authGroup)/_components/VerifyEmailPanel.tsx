'use client';

import { useState, useTransition } from 'react';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';

import { resendVerificationAction } from '../_actions/authActions';
import { Button } from '@/components/ui/button';

export function VerifyEmailPanel({ email }: { email?: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function resend() {
    startTransition(async () => {
      const result = await resendVerificationAction();
      setMessage(result.message);
    });
  }

  return (
    <div className="flex h-full flex-col items-center justify-center py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <ShieldCheck className="h-7 w-7 text-primary" />
      </span>

      <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
        Check your email
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        We sent a verification link to{' '}
        <span className="font-medium text-foreground">{email ?? 'your email address'}</span>.
        Verify your account to start renting gear.
      </p>

      <Button
        type="button"
        onClick={resend}
        disabled={isPending}
        variant="outline"
        className="mt-6"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" />
            Resend verification email
          </>
        )}
      </Button>

      {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
