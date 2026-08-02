// TanStack Query — admin user table w/ search/pagination and optimistic suspend/activate
"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "@/service/getAdminUsers";

export function useAdminUsersQuery(
  search: string,
  page: number,
  limit = 10
) {
  return useQuery({
    queryKey: ["admin-users", search, page, limit],

    queryFn: () =>
      getAdminUsers(search, page, limit),

    placeholderData: (previous) => previous,

    staleTime: 60 * 1000,
  });
}