// Renders reviews fetched via _actions/getGearReviews.ts on the gear detail page
"use client";

import { Star } from "lucide-react";

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

export default function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">
          No reviews yet. Be the first to review this gear.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border p-5">
          {/* User */}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {review.user?.name ?? "Anonymous"}
              </h3>

              <p className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Rating */}

            <div className="flex items-center gap-1">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  className={
                    index < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>

          {/* Comment */}

          <p className="mt-4 text-sm leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
