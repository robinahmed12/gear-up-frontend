"use server";
// Server action/fetcher — GET ${BACKEND_API_URL}/api/gear with search/category/price/availability/sort/pagination query params, cache:'force-cache' + next.tags:['gear-list'] for revalidation after provider mutations
"use server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export interface GetGearParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  availableFrom?: string;
  availableTo?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getGear(params?: GetGearParams) {
  try {
    const query = new URLSearchParams();

    if (params?.search) query.append("search", params.search);

    if (params?.category) {
      query.append("category", params.category);
    }

    if (params?.minPrice) {
      query.append("minPrice", params.minPrice.toString());
    }

    if (params?.maxPrice) {
      query.append("maxPrice", params.maxPrice.toString());
    }

    if (params?.availableFrom) {
      query.append("availableFrom", params.availableFrom);
    }

    if (params?.availableTo) {
      query.append("availableTo", params.availableTo);
    }

    if (params?.sort) {
      query.append("sort", params.sort);
    }

    if (params?.page) {
      query.append("page", params.page.toString());
    }

    if (params?.limit) {
      query.append("limit", params.limit.toString());
    }

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
