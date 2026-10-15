"use server";
// Provider availability-block CRUD -> GET/POST /api/provider/gear/:id/blocks and
// DELETE /api/provider/gear/:id/blocks/:blockId
// app/(dashboardGroup)/_actions/availabilityActions.ts

import { cookies } from "next/headers";

interface ActionResult {
  success: boolean;
  message: string;
}

interface ListResult {
  success: boolean;
  message: string;
  data?: unknown;
}

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function listBlocksAction(gearId: string): Promise<ListResult> {
  try {
    const token = await getToken();

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gear/${gearId}/blocks`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, cache: "no-store" },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? "Failed to load blocks" };
    }

    return { success: true, message: result.message ?? "", data: result.data };
  } catch {
    return { success: false, message: "Could not reach the server" };
  }
}

export async function createBlockAction(
  gearId: string,
  input: { startDate: string; endDate: string; reason?: string },
): Promise<ActionResult> {
  try {
    const token = await getToken();

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gear/${gearId}/blocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? "Failed to create block" };
    }

    return { success: true, message: result.message ?? "Availability block created" };
  } catch {
    return { success: false, message: "Could not reach the server" };
  }
}

export async function deleteBlockAction(gearId: string, blockId: string): Promise<ActionResult> {
  try {
    const token = await getToken();

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/provider/gear/${gearId}/blocks/${blockId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? "Failed to delete block" };
    }

    return { success: true, message: result.message ?? "Availability block deleted" };
  } catch {
    return { success: false, message: "Could not reach the server" };
  }
}
