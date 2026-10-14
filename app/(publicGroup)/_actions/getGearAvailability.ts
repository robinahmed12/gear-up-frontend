"use server";
// GET /api/gear/:id/availability?startDate&endDate&quantity — public, no auth.
// Returns the AvailabilityResult the backend computes for the requested window.

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export async function getGearAvailabilityAction(
  gearId: string,
  startDate: string,
  endDate: string,
  quantity = 1,
): Promise<{ success: boolean; data?: unknown; message?: string }> {
  try {
    const params = new URLSearchParams({
      startDate,
      endDate,
      quantity: String(quantity),
    });

    const response = await fetch(
      `${BACKEND_API_URL}/api/gear/${gearId}/availability?${params.toString()}`,
      { method: "GET", cache: "no-store" },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { success: false, message: result.message ?? "Availability check failed" };
    }

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Could not reach the server",
    };
  }
}
