// hooks/use-provider-orders-query.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateOrderStatusAction } from "@/app/(dashboardGroup)/_actions/providerOrderActions";
import type { NextStatus, RentalOrder } from "@/lib/types";

const PROVIDER_ORDERS_KEY = ["provider-orders"];

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: NextStatus;
    }) => updateOrderStatusAction(orderId, status),

    // Optimistic update
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({
        queryKey: PROVIDER_ORDERS_KEY,
      });

      const previousOrders =
        queryClient.getQueryData<RentalOrder[]>(
          PROVIDER_ORDERS_KEY,
        );

      queryClient.setQueryData<RentalOrder[]>(
        PROVIDER_ORDERS_KEY,
        (old = []) =>
          old.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                }
              : order,
          ),
      );

      return {
        previousOrders,
      };
    },

    // Roll back if the backend fails
    onError: (_error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(
          PROVIDER_ORDERS_KEY,
          context.previousOrders,
        );
      }

      toast.error("Failed to update order status");
    },

    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      // Re-render Server Components and fetch fresh provider orders
      router.refresh();
    },

    // onSettled: () => {
    //   // Don't depend on this for fetching because your actual
    //   // queryFn currently uses initialOrders.
    //   queryClient.invalidateQueries({
    //     queryKey: PROVIDER_ORDERS_KEY,
    //   });
    // },
  });
}