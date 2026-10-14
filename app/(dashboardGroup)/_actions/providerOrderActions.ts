"use server"
// updateOrderStatusAction(orderId, status: 'CONFIRMED'|'PICKED_UP'|'RETURNED') -> PATCH /api/provider/orders/:id/status
// app/(dashboardGroup)/_actions/providerOrderActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import type { RentalStatus } from '@/lib/types';

interface ActionResult {
  success: boolean;
  message: string;
}

export async function cancelProviderOrderAction(
  orderId: string,
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Provider cancel failed' };
    }

    revalidateTag('provider-orders', 'max');
    return { success: true, message: result.message ?? 'Order cancelled' };
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: Extract<RentalStatus, 'CONFIRMED' | 'PICKED_UP' | 'RETURNED'>,
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        cache: "no-store",
      },
      body: JSON.stringify({ status }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to update order status' };
    }

    revalidateTag('provider-orders', "max");
    return { success: true, message: `Order marked as ${status.replace('_', ' ').toLowerCase()}` };
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}