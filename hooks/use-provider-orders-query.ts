// TanStack Query — incoming orders table w/ optimistic status updates on Confirm/Mark Picked Up/Mark Returned
// hooks/use-provider-orders-query.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateOrderStatusAction } from '@/app/(dashboardGroup)/_actions/providerOrderActions';
import type { NextStatus, RentalOrder} from '@/lib/types';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
  mutationFn: ({ orderId, status }: { orderId: string; status: NextStatus }) =>
      updateOrderStatusAction(orderId, status),
    // Optimistic update — the row's badge/buttons change instantly instead
    // of waiting for the server action + revalidation round-trip, per the
    // original scaffold's "optimistic UI" requirement for this table.
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['provider-orders'] });
      const previous = queryClient.getQueryData<RentalOrder[]>(['provider-orders']);

      queryClient.setQueryData<RentalOrder[]>(['provider-orders'], (old) =>
        old?.map((order) => (order.id === orderId ? { ...order, status } : order)),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // Roll back to the pre-mutation list if the server call actually failed.
      if (context?.previous) {
        queryClient.setQueryData(['provider-orders'], context.previous);
      }
      toast.error('Failed to update order status');
    },

    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-orders'] });
    },
  });
}