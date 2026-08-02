"use server"
// service/getAdminRentals.ts
'use server';

import { cookies } from 'next/headers';
import type { RentalOrder, ApiSuccessResponse } from '@/lib/types';

interface GetAdminRentalsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export async function getAdminRentals(
  params: GetAdminRentalsParams = {},
): Promise<ApiSuccessResponse<RentalOrder[]> | { success: false; message: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    query.set('page', String(params.page ?? 1));
    query.set('limit', String(params.limit ?? 10));

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/rentals?${query}`, {
      headers: { Cookie: `accessToken=${token}` },
      cache: 'no-store',
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to load rentals' };
    }

    return result;
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}