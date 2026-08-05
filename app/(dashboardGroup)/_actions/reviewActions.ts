// app/(dashboardGroup)/_actions/reviewActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import type { ReviewFormValues } from '@/lib/validation';

interface ReviewActionResult {
  success: boolean;
  message: string;
}

/**
 * Backend enforces the real rules here (only after RETURNED, one review
 * per rental order) — this action just forwards the request and surfaces
 * whatever the backend actually says. If someone lands on this page for
 * an order that isn't RETURNED or was already reviewed, they'll get the
 * backend's real error message, not a frontend guess at one.
 */
export async function createReviewAction(
  rentalOrderId: string,
  gearId: string,
  values: ReviewFormValues,
): Promise<ReviewActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rentalOrderId,
        rating: values.rating,
        comment: values.comment || undefined,
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to submit review' };
    }

    // So the gear's averageRating/reviewCount (and the review list) show
    // the new review immediately on the detail page.
    revalidateTag(`gear-detail-${gearId}`, "max");
    revalidateTag('my-rentals', "max");

    return { success: true, message: 'Review submitted' };
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}