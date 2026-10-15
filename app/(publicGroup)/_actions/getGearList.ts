"use server";
// Server action/fetcher — GET ${BACKEND_API_URL}/api/gear with
// search/category/price/availability/sort/pagination query params.
// The public browse UI uses friendly keys (category, sort) that are mapped
// here to the backend's actual contract (categoryId, sortBy + sortOrder).

import type { Gear } from "@/lib/types";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export type GearSort = "latest" | "price_asc" | "price_desc" | "rating";

export interface GetGearParams {
  search?: string;
  /** Category id (the URL keeps the friendly name "category"). */
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  sort?: GearSort;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GearListResponse {
  success: boolean;
  data: Gear[] | null;
  meta?: PaginationMeta;
  message?: string;
}

const SORT_MAP: Record<GearSort, { sortBy: string; sortOrder: string }> = {
  latest: { sortBy: "newest", sortOrder: "desc" },
  price_asc: { sortBy: "price", sortOrder: "asc" },
  price_desc: { sortBy: "price", sortOrder: "desc" },
  rating: { sortBy: "rating", sortOrder: "desc" },
};

export async function getGear(params?: GetGearParams): Promise<GearListResponse> {
  try {
    const query = new URLSearchParams();

    if (params?.search?.trim()) query.append("search", params.search.trim());

    // The backend filters by categoryId; the browse UI names it "category".
    if (params?.category) query.append("categoryId", params.category);

    if (params?.minPrice !== undefined) query.append("minPrice", String(params.minPrice));

    if (params?.maxPrice !== undefined) query.append("maxPrice", String(params.maxPrice));

    if (params?.isAvailable !== undefined) {
      query.append("isAvailable", String(params.isAvailable));
    }

    const sort = SORT_MAP[(params?.sort as GearSort) ?? "latest"] ?? SORT_MAP.latest;
    query.append("sortBy", sort.sortBy);
    query.append("sortOrder", sort.sortOrder);

    query.append("page", String(params?.page ?? 1));
    query.append("limit", String(params?.limit ?? 12));

    const url = `${BACKEND_API_URL}/api/gear?${query.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      next: {
        tags: ["gear-list"],
      },
    });

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: "Failed to fetch gear items",
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
