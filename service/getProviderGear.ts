"use server"
// GET /api/provider/gear (Cookie-forwarded), next.tags:['provider-gear']
// service/getProviderGear.ts
'use server';

import { cookies } from 'next/headers';
import type { Gear, ApiSuccessResponse } from '@/lib/types';

export async function getProviderGear(
  page = 1,
): Promise<ApiSuccessResponse<Gear[]> | { success: false; message: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/provider/gear?page=${page}&limit=20`,
      {
        headers: { Cookie: `accessToken=${token}` },
        next: { tags: ['provider-gear'] },
      },
    );

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to load your gear' };
    }

    return result;
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}