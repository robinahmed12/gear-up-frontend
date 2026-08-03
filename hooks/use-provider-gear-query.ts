// TanStack Query — provider's own gear list w/ mutate-and-invalidate on create/update/delete
// hooks/use-provider-gear-query.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteGearAction, toggleAvailabilityAction } from '@/app/(dashboardGroup)/_actions/providerGearActions';

export function useDeleteGear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gearId: string) => deleteGearAction(gearId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['provider-gear'] });
      } else {
        toast.error(result.message);
      }
    },
    onError: () => toast.error('Something went wrong'),
  });
}

export function useToggleGearAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gearId, isAvailable }: { gearId: string; isAvailable: boolean }) =>
      toggleAvailabilityAction(gearId, isAvailable),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['provider-gear'] });
      } else {
        toast.error(result.message);
      }
    },
    onError: () => toast.error('Something went wrong'),
  });
}