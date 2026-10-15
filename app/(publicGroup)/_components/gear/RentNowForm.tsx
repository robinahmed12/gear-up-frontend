// app/(publicGroup)/_components/gear/RentNowForm.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, isBefore, startOfDay, differenceInCalendarDays } from 'date-fns';
import { CalendarIcon, ShieldCheck } from 'lucide-react';

import { rentNowSchema } from '@/lib/validation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { createRentalAction } from '@/app/(dashboardGroup)/_actions/rentalActions';
import { resendVerificationAction } from '@/app/(authGroup)/_actions/authActions';
import { getGearAvailabilityAction } from '@/app/(publicGroup)/_actions/getGearAvailability';
import type { AvailabilityResult } from '@/lib/types';

interface RentNowFormProps {
  gearId: string;
  pricePerDay: number;
  available?: boolean;
  unavailableDates?: string[];
}

type RentFormValues = {
  startDate?: Date;
  endDate?: Date;
};

export default function RentNowForm({
  gearId,
  pricePerDay,
  available = true,
  unavailableDates = [],
}: RentNowFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [resending, setResending] = useState(false);
  const [availability, setAvailability] = useState<
    (AvailabilityResult & { key: string }) | null
  >(null);

  const form = useForm<RentFormValues>({
    resolver: zodResolver(rentNowSchema),
    defaultValues: { startDate: undefined, endDate: undefined },
  });

  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');

  const { totalDays, totalPrice } = useMemo(() => {
    if (!startDate || !endDate) return { totalDays: 0, totalPrice: 0 };
    const days = Math.max(1, differenceInCalendarDays(endDate, startDate));
    return { totalDays: days, totalPrice: days * pricePerDay };
  }, [startDate, endDate, pricePerDay]);

  // Re-check availability whenever the selected window changes. The result is
  // stored alongside the exact window it was computed for (its `key`) so a
  // stale result from a previous range is never shown for the current one.
  useEffect(() => {
    if (!startDate || !endDate) return;

    const key = `${startDate.toISOString()}_${endDate.toISOString()}`;
    let active = true;

    getGearAvailabilityAction(gearId, startDate.toISOString(), endDate.toISOString())
      .then((result) => {
        if (!active) return;
        setAvailability(
          result.success && result.data
            ? { ...(result.data as AvailabilityResult), key }
            : null,
        );
      })
      .catch(() => {
        if (!active) return;
        setAvailability(null);
      });

    return () => {
      active = false;
    };
  }, [gearId, startDate, endDate]);

  const activeAvailability =
    availability &&
    startDate &&
    endDate &&
    availability.key === `${startDate.toISOString()}_${endDate.toISOString()}`
      ? availability
      : null;

  function isDateDisabled(date: Date) {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return true;
    return unavailableDates.some((item) => format(date, 'yyyy-MM-dd') === item);
  }

  async function onSubmit(values: RentFormValues) {
    try {
      setLoading(true);

      const result = await createRentalAction(
        gearId,
        1,
        values.startDate!.toISOString(),
        values.endDate!.toISOString(),
      );

      if (result?.unauthorized) {
        router.push(`/login?redirect=/gear/${gearId}`);
        return;
      }

      if (!result.success) {
        if (/verify your email/i.test(result.message ?? '')) {
          setVerificationError(true);
          return;
        }
        toast.error(result.message ?? 'Rental failed');
        return;
      }

      toast.success('Rental request created');
      router.push('/dashboard/my-orders');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!available) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-center">
        <p className="text-sm font-medium text-destructive">
          This gear is currently unavailable.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Check back later or browse similar gear.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {verificationError && (
        <div className="mb-5 space-y-3 rounded-md border border-destructive/20 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">Email not verified</p>
          <p className="text-sm text-destructive/90">
            Please verify your email address before continuing.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={resending}
            onClick={() => {
              setResending(true);
              resendVerificationAction()
                .then((r) => {
                  if (r.success) {
                    toast.success(r.message);
                    setVerificationError(false);
                  } else {
                    toast.error(r.message);
                  }
                })
                .finally(() => setResending(false));
            }}
          >
            {resending ? 'Sending...' : 'Resend verification email'}
          </Button>
        </div>
      )}

      <h2 className="text-lg font-semibold text-foreground">Rent this gear</h2>
      <p className="mt-1 text-2xl font-bold text-foreground">
        ৳{pricePerDay}
        <span className="text-sm font-normal text-muted-foreground">/day</span>
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className="w-full justify-start font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {field.value ? format(field.value, 'PP') : 'Select date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isDateDisabled}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className="w-full justify-start font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {field.value ? format(field.value, 'PP') : 'Select date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isDateDisabled}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Live price breakdown — only shows once both dates are picked */}
          {totalDays > 0 && (
            <div className="space-y-1.5 rounded-md bg-muted/60 p-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  ৳{pricePerDay} × {totalDays} day{totalDays === 1 ? '' : 's'}
                </span>
                <span>৳{totalPrice}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1.5 font-semibold text-foreground">
                <span>Total</span>
                <span>৳{totalPrice}</span>
              </div>
            </div>
          )}

          {activeAvailability && !activeAvailability.available && (
            <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              {activeAvailability.reason ?? 'This gear is not available for the selected dates.'}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || (activeAvailability !== null && !activeAvailability.available)}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            size="lg"
          >
            {loading ? 'Processing...' : 'Rent now'}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure payment, provider-verified
          </p>
        </form>
      </Form>
    </div>
  );
}