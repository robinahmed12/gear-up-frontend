'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

import { verifyEmailAction } from '../_actions/authActions';
import { Button } from '@/components/ui/button';

type Status = 'verifying' | 'success' | 'error';

export function VerifyEmailForm({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'error');
  const [message, setMessage] = useState(
    token ? 'Verifying your email...' : 'Missing verification token.',
  );

  useEffect(() => {
    if (!token) return;

    let active = true;

    verifyEmailAction(token)
      .then((result) => {
        if (!active) return;
        setStatus(result.success ? 'success' : 'error');
        setMessage(result.message);
      })
      .catch(() => {
        if (!active) return;
        setStatus('error');
        setMessage('Could not reach the server. Please try again.');
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="flex flex-col items-center py-10 text-center">
      {status === 'verifying' && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
            Email verified
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {message} You can now log in to your account.
          </p>
          <Button asChild className="mt-6">
            <Link href="/login">Continue to login</Link>
          </Button>
        </>
      )}

      {status === 'error' && (
        <>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-8 w-8 text-destructive" />
          </span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
            Verification failed
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {message} The link may have expired — request a new one from the login page.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/login">Back to login</Link>
          </Button>
        </>
      )}
    </div>
  );
}
