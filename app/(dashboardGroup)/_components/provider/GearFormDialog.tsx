// Shared create/edit gear form — React Hook Form + Zod (gearSchema), title/description/brand/price/stock/category-select/image URLs/availability toggle. Used by both provider-dashboard/gear/new and .../[id]/edit
// app/(dashboardGroup)/_components/provider/GearFormDialog.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Loader2, ImagePlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { gearSchema, type GearFormValues } from '@/lib/validation';
import { createGearAction, updateGearAction } from '../../_actions/providerGearActions';
import type { Gear, Category } from '@/lib/types';

interface GearFormDialogProps {
  mode: 'create' | 'edit';
  categories: Category[];
  gear?: Gear; // required when mode="edit"
}

export function GearFormDialog({ mode, categories, gear }: GearFormDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageInput, setImageInput] = useState('');

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
    const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

  const images = watch('images');

  function addImage() {
    const trimmed = imageInput.trim();
    if (!trimmed) return;
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

  const onSubmit = async (values: GearFormValues) => {
    setServerError(null);

    const result =
      mode === 'create' ? await createGearAction(values) : await updateGearAction(gear!.id, values);

    if (!result.success) {
      setServerError(result.message);
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.replace('/provider-dashboard/gear');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <p
            role="alert"
            className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            {serverError}
          </p>
        )}

        <div className="rounded-lg border border-border bg-card p-5 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Basic details</h2>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Trek Mountain Bike" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand (optional)</Label>
              <Input id="brand" placeholder="Trek" {...register('brand')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register('categoryId')}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={4}
              placeholder="21-speed hardtail, great for trail riding..."
              className="w-full resize-none rounded-md border border-input bg-background p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-5">
          <h2 className="text-sm font-semibold text-foreground">Pricing & stock</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price per day (৳)</Label>
              <Input id="pricePerDay" type="number" min={0} step="0.01" {...register('pricePerDay')} />
              {errors.pricePerDay && (
                <p className="text-sm text-destructive">{errors.pricePerDay.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" min={0} {...register('stock')} />
              {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Images</h2>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <ImagePlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="https://example.com/bike.jpg"
                className="pl-9"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
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
          {errors.images && <p className="text-sm text-destructive">{errors.images.message}</p>}

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 pt-1 sm:grid-cols-4">
              {images.map((url, index) => (
                <div key={url + index} className="group relative aspect-square overflow-hidden rounded-md bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = '0.3';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/provider-dashboard/gear')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Saving...'}
              </>
            ) : mode === 'create' ? (
              'Create gear'
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}