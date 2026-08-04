"use server"
// createGearAction, updateGearAction, deleteGearAction -> POST/PUT/DELETE /api/provider/gear[/:id]; revalidateTag('gear-list') + revalidateTag('provider-gear') on success so public listings reflect changes
// app/(dashboardGroup)/_actions/providerGearActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

interface ActionResult {
  success: boolean;
  message: string;
}

export async function deleteGearAction(gearId: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gear/${gearId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to delete gear' };
    }

    revalidateTag('provider-gear', "max");
    revalidateTag('gear-list', "max");
    return { success: true, message: 'Gear deleted' };
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}

// app/(dashboardGroup)/_actions/providerGearActions.ts (add alongside deleteGearAction/toggleAvailabilityAction)


import type { GearFormValues } from '@/lib/validation';
import type { Gear } from '@/lib/types';

interface GearActionResult {
  success: boolean;
  message: string;
  data?: Gear;
}


export async function createGearAction(input: GearFormValues): Promise<GearActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to create gear' };
    }

    revalidateTag('provider-gear', "max");
    revalidateTag('gear-list', "max");
    return { success: true, message: 'Gear created', data: result.data };
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}

export async function updateGearAction(
  gearId: string,
  input: GearFormValues,
): Promise<GearActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gear/${gearId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to update gear' };
    }

    revalidateTag('provider-gear', "max");
    revalidateTag('gear-list', "max");
    revalidateTag(`gear-detail-${gearId}`, "max");
    return { success: true, message: 'Gear updated', data: result.data };
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}

export async function toggleAvailabilityAction(
  gearId: string,
  isAvailable: boolean,
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gear/${gearId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isAvailable }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to update gear' };
    }

    revalidateTag('provider-gear', "max");
    revalidateTag('gear-list', "max");
    return { success: true, message: isAvailable ? 'Marked available' : 'Marked unavailable' };
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}