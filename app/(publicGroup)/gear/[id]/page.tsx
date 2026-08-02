// app/(publicGroup)/gear/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, ShieldCheck, ChevronRight } from 'lucide-react';
import { getGearById } from '../../_actions/getGearById';
import { getGearReviews } from '../../_actions/getGearReviews';
import ReviewList from '../../_components/reviews/ReviewList';
import RentNowForm from '../../_components/gear/RentNowForm';
import GearGallery from '../../_components/gear/GearGallery';

interface GearDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicGroupGearByIdPage({ params }: GearDetailsPageProps) {
  const { id } = await params;

  const [gearResponse, reviewResponse] = await Promise.all([
    getGearById(id),
    getGearReviews(id),
  ]);

  if (!gearResponse.success || !gearResponse.data) {
    notFound();
  }

  const gear = gearResponse.data;
  const reviews = reviewResponse?.data ?? [];

  return (
    <main className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/gear" className="hover:text-foreground">
            Gear
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-foreground">{gear.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Gallery */}
          <GearGallery
            mainImage={gear.image ?? '/placeholder.png'}
            images={gear.images ?? []}
            name={gear.name}
          />

          {/* Info + rent form */}
          <div className="space-y-6">
            <div>
              {gear.category?.name && (
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {gear.category.name}
                </p>
              )}
              <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-foreground">
                {gear.name}
              </h1>

              {typeof gear.averageRating === 'number' && gear.reviewCount > 0 && (
                <div className="mt-2 flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-rating text-rating" />
                  <span className="text-sm font-medium text-foreground">
                    {gear.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({gear.reviewCount} review{gear.reviewCount === 1 ? '' : 's'})
                  </span>
                </div>
              )}
            </div>

            {/* Price + availability */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-5">
              <p className="text-2xl font-bold text-foreground">
                ৳{gear.pricePerDay}
                <span className="text-sm font-normal text-muted-foreground">/day</span>
              </p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  gear.availability
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-destructive text-destructive-foreground'
                }`}
              >
                {gear.availability ? 'Available' : 'Currently unavailable'}
              </span>
            </div>

            {/* Description */}
            <div>
              <h2 className="mb-2 text-lg font-semibold text-foreground">Description</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{gear.description}</p>
            </div>

            {/* Provider */}
            {gear.provider && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {gear.provider.name?.[0]?.toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                    {gear.provider.name}
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{gear.provider.email}</p>
                </div>
              </div>
            )}

            {/* Rent form */}
            <RentNowForm
              gearId={gear.id}
              pricePerDay={gear.pricePerDay}
              available={gear.availability}
            />
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Customer reviews
            {reviews.length > 0 && (
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({reviews.length})
              </span>
            )}
          </h2>
          <ReviewList reviews={reviews} />
        </section>
      </div>
    </main>
  );
}