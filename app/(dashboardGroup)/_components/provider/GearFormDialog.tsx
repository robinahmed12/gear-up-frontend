// Shared create/edit gear form — React Hook Form + Zod (gearSchema)
// app/(dashboardGroup)/_components/provider/GearFormDialog.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  ChevronDown,
  ImagePlus,
  Loader2,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { gearSchema, type GearFormValues } from '@/lib/validation';
import { createGearAction, updateGearAction } from '../../_actions/providerGearActions';
import type { Gear, Category } from '@/lib/types';

interface GearFormDialogProps {
  mode: 'create' | 'edit';
  categories: Category[];
  gear?: Gear; // required when mode="edit"
}

const DESCRIPTION_MAX = 500;

/* ---------- small building blocks ---------- */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <header className="border-b border-border px-5 py-4 sm:px-6">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="space-y-5 px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

const fieldBase =
  'w-full rounded-md border bg-background text-sm text-foreground placeholder:text-muted-foreground ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const errorRing = 'border-destructive focus-visible:ring-destructive/40';

/* ---------- main component ---------- */

export function GearFormDialog({ mode, categories, gear }: GearFormDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageInput, setImageInput] = useState('');
  const [imageInputError, setImageInputError] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const form = useForm<GearFormValues>({
    resolver: zodResolver(gearSchema),
    defaultValues: gear
      ? {
          title: gear.title,
          description: gear.description,
          brand: gear.brand ?? '',
          pricePerDay: gear.pricePerDay,
          stock: gear.stock,
          categoryId: gear.categoryId,
          images: gear.images ?? [],
        }
      : {
          title: '',
          description: '',
          brand: '',
          pricePerDay: 0,
          stock: 1,
          categoryId: '',
          images: [],
        },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = form;

  const images = watch('images');
  const descriptionLength = (watch('description') ?? '').length;

  function addImage() {
    const trimmed = imageInput.trim();
    if (!trimmed) return;

    try {
      const url = new URL(trimmed);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error();
    } catch {
      setImageInputError('Enter a full image link starting with https://');
      return;
    }
    if (images.includes(trimmed)) {
      setImageInputError('This image is already added.');
      return;
    }

    setImageInputError(null);
    setValue('images', [...images, trimmed], { shouldValidate: true });
    setImageInput('');
  }

  function removeImage(index: number) {
    setValue(
      'images',
      images.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  }

  function makeCover(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    setValue('images', next, { shouldValidate: true });
  }

  function stepStock(delta: number) {
    const current = Number(getValues('stock')) || 0;
    setValue('stock', Math.max(0, current + delta), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  const onSubmit = async (values: GearFormValues) => {
    setServerError(null);

    const result =
      mode === 'create'
        ? await createGearAction(values)
        : await updateGearAction(gear!.id, values);

    if (!result.success) {
      setServerError(result.message);
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.replace('/provider-dashboard/gear');
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 pb-28 sm:pb-0">
        {serverError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>{serverError}</p>
          </div>
        )}

        {/* Basic details */}
        <Section
          title="Basic details"
          description="What renters see first when they find your gear."
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Trek Mountain Bike"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              className={cn(errors.title && errorRing)}
              {...register('title')}
            />
            <FieldError id="title-error" message={errors.title?.message} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">
                Brand <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input id="brand" placeholder="Trek" {...register('brand')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <div className="relative">
                <select
                  id="categoryId"
                  aria-invalid={!!errors.categoryId}
                  aria-describedby={errors.categoryId ? 'category-error' : undefined}
                  className={cn(
                    fieldBase,
                    'h-9 appearance-none border-input py-0 pl-3 pr-9',
                    errors.categoryId && errorRing,
                  )}
                  {...register('categoryId')}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
              <FieldError id="category-error" message={errors.categoryId?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="description">Description</Label>
              <span
                className={cn(
                  'text-xs tabular-nums',
                  descriptionLength > DESCRIPTION_MAX
                    ? 'text-destructive'
                    : 'text-muted-foreground',
                )}
              >
                {descriptionLength}/{DESCRIPTION_MAX}
              </span>
            </div>
            <textarea
              id="description"
              rows={5}
              placeholder="21-speed hardtail, great for trail riding. Includes helmet and lock."
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
              className={cn(
                fieldBase,
                'resize-y border-input px-3 py-2.5 leading-relaxed',
                errors.description && errorRing,
              )}
              {...register('description')}
            />
            <FieldError id="description-error" message={errors.description?.message} />
          </div>
        </Section>

        {/* Pricing & stock */}
        <Section
          title="Pricing and stock"
          description="Set your daily rate and how many units you can rent out at once."
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price per day</Label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground"
                  aria-hidden
                >
                  ৳
                </span>
                <Input
                  id="pricePerDay"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  aria-invalid={!!errors.pricePerDay}
                  aria-describedby={errors.pricePerDay ? 'price-error' : undefined}
                  className={cn('pl-7 tabular-nums', errors.pricePerDay && errorRing)}
                  {...register('pricePerDay')}
                />
              </div>
              <FieldError id="price-error" message={errors.pricePerDay?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Units in stock</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => stepStock(-1)}
                  aria-label="Decrease stock"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="stock"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  aria-invalid={!!errors.stock}
                  aria-describedby={errors.stock ? 'stock-error' : undefined}
                  className={cn(
                    'text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                    errors.stock && errorRing,
                  )}
                  {...register('stock')}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => stepStock(1)}
                  aria-label="Increase stock"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FieldError id="stock-error" message={errors.stock?.message} />
            </div>
          </div>
        </Section>

        {/* Images */}
        <Section
          title="Photos"
          description="The first photo is the cover. Good photos get more bookings."
        >
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image link</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImagePlus
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/bike.jpg"
                  className={cn('pl-9', imageInputError && errorRing)}
                  value={imageInput}
                  aria-invalid={!!imageInputError}
                  aria-describedby={imageInputError ? 'image-input-error' : undefined}
                  onChange={(e) => {
                    setImageInput(e.target.value);
                    if (imageInputError) setImageInputError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                />
              </div>
              <Button type="button" variant="outline" onClick={addImage}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <FieldError id="image-input-error" message={imageInputError ?? undefined} />
            <FieldError id="images-error" message={errors.images?.message} />
          </div>

          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-10 text-center">
              <ImagePlus className="h-6 w-6 text-muted-foreground" aria-hidden />
              <p className="mt-2 text-sm font-medium text-foreground">No photos yet</p>
              <p className="text-sm text-muted-foreground">Paste an image link above to add one.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((url, index) => (
                <li
                  key={url + index}
                  className={cn(
                    'group relative aspect-square overflow-hidden rounded-lg bg-muted ring-1 ring-border',
                    index === 0 && 'ring-2 ring-primary',
                  )}
                >
                  {brokenImages[url] ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center text-xs text-muted-foreground">
                      <AlertCircle className="h-4 w-4" aria-hidden />
                      Can&apos;t load image
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={`Gear photo ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={() => setBrokenImages((prev) => ({ ...prev, [url]: true }))}
                    />
                  )}

                  {index === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                      Cover
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove photo ${index + 1}`}
                    className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1.5 text-foreground shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeCover(index)}
                      className="absolute inset-x-0 bottom-0 bg-foreground/70 py-1.5 text-xs font-medium text-background transition-opacity hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                    >
                      Set as cover
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Actions: sticky on mobile, inline on desktop */}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:static sm:z-auto sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <div className="mx-auto flex max-w-3xl flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="sm:min-w-28"
              onClick={() => router.push('/provider-dashboard/gear')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent text-accent-foreground hover:bg-accent/90 sm:min-w-40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating…' : 'Saving…'}
                </>
              ) : mode === 'create' ? (
                'Create gear'
              ) : (
                'Save changes'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}