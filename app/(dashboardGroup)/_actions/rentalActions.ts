"use server";
// createRentalAction(gearId, quantity, startDate, endDate) -> POST /api/rentals; cancelRentalAction(id) -> PATCH /api/rentals/:id/cancel. Forwards Cookie: accessToken=... header, revalidateTag('my-rentals') on success
"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

async function getAccessToken() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  return accessToken ?? null;
}

// Create Rental
export async function createRentalAction(
  gearId: string,
  quantity: number,
  startDate: string,
  endDate: string,
) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        unauthorized: true,
        message: "Please login first",
      };
    }

    const response = await fetch(`${BACKEND_API_URL}/api/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        gearId,
        quantity,
        startDate,
        endDate,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Rental creation failed",
      };
    }

    revalidateTag("my-rentals", "max");

    return {
      success: true,
      data: data.data ?? data,
      message: "Rental created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

// Cancel Rental

export async function cancelRentalAction(id: string) {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${BACKEND_API_URL}/api/rentals/${id}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Cancel rental failed",
      };
    }

    revalidateTag("my-rentals", "max");

    return {
      success: true,
      data: data.data ?? data,
      message: "Rental cancelled successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
