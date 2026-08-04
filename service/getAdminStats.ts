// service/getAdminStats.ts
'use server';

import { cookies } from 'next/headers';
import type { RentalStatus } from '@/lib/types';

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalProviders: number;
  totalGear: number;
  activeGear: number;
  totalRentals: number;
  totalRevenue: number;
  rentalsByStatus: Record<RentalStatus, number>;
}

const emptyStats: AdminStats = {
  totalUsers: 0,
  totalCustomers: 0,
  totalProviders: 0,
  totalGear: 0,
  activeGear: 0,
  totalRentals: 0,
  totalRevenue: 0,
  rentalsByStatus: {
    PLACED: 0,
    CONFIRMED: 0,
    PAID: 0,
    PICKED_UP: 0,
    RETURNED: 0,
    CANCELLED: 0,
  },
};

/**
 * The backend doesn't expose a single aggregate stats endpoint, so this
 * combines the three existing admin list endpoints and derives counts
 * client-side (server-side here, since this runs in a Server Action).
 * Requests a large limit on each so the aggregation reflects the whole
 * platform, not just page 1 — swap for a dedicated backend endpoint later
 * if these lists grow large enough to make that wasteful.
 */
export async function getAdminStats(): Promise<{ success: boolean; data: AdminStats }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const headers = { Authorization: `Bearer ${token}` };

    const [usersRes, gearRes, rentalsRes] = await Promise.all([
      fetch(`${process.env.BACKEND_API_URL}/api/admin/users`, { headers, cache: 'no-store' }),
      fetch(`${process.env.BACKEND_API_URL}/api/admin/gear`, { headers, cache: 'no-store' }),
      fetch(`${process.env.BACKEND_API_URL}/api/admin/rentals`, { headers, cache: 'no-store' }),
    ]);

    const [usersJson, gearJson, rentalsJson] = await Promise.all([
      usersRes.json(),
      gearRes.json(),
      rentalsRes.json(),
    ]);

    const users = usersJson?.data ?? [];

    const gear = gearJson?.data ?? [];
    const rentals = rentalsJson?.data ?? [];

    const rentalsByStatus = { ...emptyStats.rentalsByStatus };
    let totalRevenue = 0;

    for (const rental of rentals) {
      if (rental.status in rentalsByStatus) {
        rentalsByStatus[rental.status as RentalStatus] += 1;
      }
      if (rental.status === 'RETURNED' || rental.status === 'PICKED_UP') {
        totalRevenue += Number(rental.totalAmount ?? 0);
      }
    }

    return {
      success: true,
      data: {
        totalUsers: users.length,
        totalCustomers: users.filter((u: { role: string }) => u.role === 'CUSTOMER').length,
        totalProviders: users.filter((u: { role: string }) => u.role === 'PROVIDER').length,
        totalGear: gear.length,
        activeGear: gear.filter((g: { isAvailable: boolean }) => g.isAvailable).length,
        totalRentals: rentals.length,
        totalRevenue,
        rentalsByStatus,
      },
    };
  } catch {
    return { success: false, data: emptyStats };
  }
}