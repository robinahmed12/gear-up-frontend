// Client Component — React Hook Form + Zod (lib/validation.ts rentNowSchema), date-range picker, prevents past/overlapping dates, calls (dashboardGroup)/_actions/rentalActions.ts createRentalAction on submit (redirects to login if unauthenticated)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { rentNowSchema } from "@/lib/validation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { createRentalAction } from "@/app/(dashboardGroup)/_actions/rentalActions";

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


  const form = useForm<RentFormValues>({
  resolver: zodResolver(rentNowSchema),
  defaultValues: {
    startDate: undefined,
    endDate: undefined,
  },
});

  function isDateDisabled(date: Date) {
    const today = startOfDay(new Date());

    if (isBefore(date, today)) {
      return true;
    }

    return unavailableDates.some((item) => format(date, "yyyy-MM-dd") === item);
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
        router.push(`/auth/login?redirect=/gear/${gearId}`);

        return;
      }

      if (!result.success) {
        toast.error(result.message ?? "Rental failed");

        return;
      }

      toast.success("Rental request created");

      router.push("/dashboard/my-orders");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!available) {
    return (
      <div className="rounded-lg border p-5 text-center">
        <p className="text-red-500">This gear is currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-5">
      <h2 className="mb-4 text-xl font-semibold">Rent This Gear</h2>

      <p className="mb-5 text-lg font-bold">
        ৳{pricePerDay}
        <span className="text-sm font-normal">/day</span>
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Start Date */}

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />

                        {field.value
                          ? format(field.value, "PPP")
                          : "Select date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent>
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

          {/* End Date */}

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />

                        {field.value
                          ? format(field.value, "PPP")
                          : "Select date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <PopoverContent>
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Rent Now"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
