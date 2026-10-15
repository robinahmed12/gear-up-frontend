import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { VerifyEmailForm } from '../_components/VerifyEmailForm';
import { VerifyEmailPanel } from '../_components/VerifyEmailPanel';
import { VerifyOtpForm } from '../_components/VerifyOtpForm';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; pending?: string; email?: string }>;
}) {
  const { token, pending, email } = await searchParams;

  if (!token && !pending && !email) notFound();

  if (token) {
    return <VerifyEmailForm token={token} />;
  }

  if (email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <VerifyOtpForm email={email} />
        </div>
      </div>
    );
  }

  const cookieStore = await cookies();
  const pendingEmail = cookieStore.get('pendingVerificationEmail')?.value;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <VerifyEmailPanel email={pendingEmail} pending />
      </div>
    </div>
  );
}