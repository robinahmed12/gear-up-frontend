// app/(publicGroup)/gear/[id]/review/page.tsx
import { redirect, notFound } from 'next/navigation';
import { getGearById } from '../../../_actions/getGearById';
import ReviewForm from '@/app/(dashboardGroup)/_components/customer/ReviewFormDialog';


interface ReviewPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ rental?: string }>;
}

export default async function GearReviewPage({ params, searchParams }: ReviewPageProps) {
  const { id: gearId } = await params;
  const { rental: rentalOrderId } = await searchParams;

  if (!rentalOrderId) {
    // No ?rental= means they navigated here directly, not from an
    // actual RETURNED order row — nothing to review against.
    redirect(`/gear/${gearId}`);
  }

  const gearResponse = await getGearById(gearId);

  if (!gearResponse.success || !gearResponse.data) {
    notFound();
  }

  return (
    <ReviewForm
      rentalOrderId={rentalOrderId}
      gearId={gearId}
      gearTitle={gearResponse.data.title}
    />
  );
}