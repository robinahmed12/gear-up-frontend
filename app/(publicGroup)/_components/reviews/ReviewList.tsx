// app/(publicGroup)/_components/reviews/ReviewList.tsx
import { Star, BadgeCheck } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
        <Star className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium text-foreground">No reviews yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Be the first to review this gear after your rental.
        </p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-5 py-4">
        <span className="text-2xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              className={
                index < Math.round(averageRating)
                  ? 'fill-rating text-rating'
                  : 'text-muted-foreground/30'
              }
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          based on {reviews.length} review{reviews.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Individual reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {getInitials(review.user?.name ?? 'A')}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-foreground">
                      {review.user?.name ?? 'Anonymous'}
                    </h3>
                    <span title="Verified renter">
                      <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    className={
                      index < review.rating ? 'fill-rating text-rating' : 'text-muted-foreground/30'
                    }
                  />
                ))}
              </div>
            </div>

            {review.comment && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}