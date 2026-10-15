// app/(publicGroup)/_components/reviews/ReviewForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { reviewSchema, type ReviewFormValues } from '@/lib/validation';
import { createReviewAction } from '@/app/(dashboardGroup)/_actions/reviewActions';

interface ReviewFormProps {
  rentalOrderId: string;
  gearId: string;
  gearTitle: string;
}

export default function ReviewForm({ rentalOrderId, gearId, gearTitle }: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  const rating = watch('rating');

  const onSubmit = (values: ReviewFormValues) => {
    setServerError(null);

    startTransition(async () => {
      const result = await createReviewAction(rentalOrderId, gearId, values);

      if (!result.success) {
        setServerError(result.message);
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.replace(`/gear/${gearId}`);
    });
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Leave a review</h1>
        <p className="mt-1 text-sm text-muted-foreground">{gearTitle}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-lg border border-border bg-card p-5">
        {serverError && (
          <p
            role="alert"
            className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            {serverError}
          </p>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Your rating</p>
          <div
            className="flex items-center gap-1"
            onMouseLeave={() => setHoveredStar(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setValue('rating', star, { shouldValidate: true })}
                onMouseEnter={() => setHoveredStar(star)}
                aria-label={`${star} star${star === 1 ? '' : 's'}`}
                className="p-0.5"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredStar || rating)
                      ? 'fill-rating text-rating'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium text-foreground">
            Comment (optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            placeholder="How was the gear? Anything future renters should know?"
            className="w-full resize-none rounded-md border border-input bg-background p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...register('comment')}
          />
          {errors.comment && <p className="text-sm text-destructive">{errors.comment.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit review'
          )}
        </Button>
      </form>
    </div>
  );
}