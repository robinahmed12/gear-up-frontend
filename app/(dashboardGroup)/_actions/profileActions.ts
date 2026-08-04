// app/(dashboardGroup)/_actions/profileActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { UpdateProfileValues, ChangePasswordValues } from '@/lib/validation';

interface ActionResult {
  success: boolean;
  message: string;
}

export async function updateProfileAction(input: UpdateProfileValues): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify({
        name: input.name,
        phone: input.phone || undefined,
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to update profile' };
    }

    // Navbar/sidebar show the user's name — refresh anywhere it's read
    // server-side so a name change is reflected immediately, not just
    // on this one page.
    revalidatePath('/', 'layout');
    return { success: true, message: 'Profile updated' };
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}

export async function changePasswordAction(input: ChangePasswordValues): Promise<ActionResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Failed to change password' };
    }

    return { success: true, message: 'Password changed successfully' };
  } catch {
    return { success: false, message: 'Could not reach the server' };
  }
}