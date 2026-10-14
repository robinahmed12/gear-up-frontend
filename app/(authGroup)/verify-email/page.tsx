import { notFound } from 'next/navigation';

import { VerifyEmailForm } from '../_components/VerifyEmailForm';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) notFound();

  return <VerifyEmailForm token={token} />;
}
