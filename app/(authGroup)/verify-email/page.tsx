import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { VerifyEmailForm } from '../_components/VerifyEmailForm';
import { VerifyEmailPanel } from '../_components/VerifyEmailPanel';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; pending?: string }>;
}) {
  const { token, pending } = await searchParams;

  if (!token && !pending) notFound();

  if (token) {
    return <VerifyEmailForm token={token} />;
  }

  const cookieStore = await cookies();
  const email = cookieStore.get('pendingVerificationEmail')?.value;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <VerifyEmailPanel email={email} pending />
      </div>
    </div>
  );
}