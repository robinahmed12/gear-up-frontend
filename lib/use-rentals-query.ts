"use client";

import { getMyRentals } from "@/service/getMyRentals";
import { useQuery } from "@tanstack/react-query";



export function useRentalsQuery() {

  return useQuery({

    queryKey: [
      "my-rentals",
    ],


    queryFn: async () => {
      const response = await getMyRentals();

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch rentals"
        );
      }

      return response;
    },


    // Live status update polling
    refetchInterval: 30000,


    // Keep previous data while refetching
    placeholderData: (previousData) =>
      previousData,


    staleTime: 1000 * 60,


  });

}