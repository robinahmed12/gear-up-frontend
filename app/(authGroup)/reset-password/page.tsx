import { notFound } from 'next/navigation';

import { ResetPasswordForm } from '../_components/ResetPasswordForm';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) notFound();

  return <ResetPasswordForm token={token} />;
}
