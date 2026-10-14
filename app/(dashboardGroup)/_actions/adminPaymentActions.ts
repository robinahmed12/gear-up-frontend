"use server";
// Admin: payments list, refund, deposit capture/release.
// app/(dashboardGroup)/_actions/adminPaymentActions.ts

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';

const API = process.env.BACKEND_API_URL || 'http://localhost:5000';

async function getToken() {
  const cs = await cookies();
  return cs.get('accessToken')?.value ?? null;
}

export async function getAdminPaymentsAction() {
  const token = await getToken();
  if (!token) return { success: false, message: 'Unauthorized', data: [] };
  const res = await fetch(`${API}/api/admin/payments`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    return { success: false, message: data.message ?? 'Failed', data: [] };
  return { success: true, message: data.message, data: data.data };
}

export async function refundPaymentAction(input: {
  rentalOrderId: string;
  paymentId: string;
  amount?: number;
  reason?: string;
}) {
  const token = await getToken();
  const res = await fetch(`${API}/api/payments/refund`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rentalOrderId: input.rentalOrderId,
      paymentId: input.paymentId,
      amount: input.amount,
      reason: input.reason,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    return { success: false, message: data.message ?? 'Refund failed' };
  revalidateTag('admin-payments', 'max');
  return { success: true, message: data.message ?? 'Refund issued' };
}

export async function captureDepositAction(rentalOrderId: string, amount?: number, reason?: string) {
  const token = await getToken();
  const res = await fetch(`${API}/api/payments/deposit/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ rentalOrderId, amount, reason }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    return { success: false, message: data.message ?? 'Capture failed' };
  revalidateTag('admin-payments', 'max');
  return { success: true, message: data.message ?? 'Captured' };
}

export async function releaseDepositAction(rentalOrderId: string) {
  const token = await getToken();
  const res = await fetch(`${API}/api/payments/deposit/release`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ rentalOrderId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    return { success: false, message: data.message ?? 'Release failed' };
  revalidateTag('admin-payments', 'max');
  return { success: true, message: data.message ?? 'Released' };
}
