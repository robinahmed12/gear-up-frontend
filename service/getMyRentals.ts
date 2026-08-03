"use server";
// GET /api/rentals (Cookie-forwarded), next.tags:['my-rentals']

import { cookies } from "next/headers";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export async function getMyRentals() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        data: [],
        message: "Unauthorized",
      };
    }

    const response = await fetch(`${BACKEND_API_URL}/api/rentals`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "force-cache",
      next: {
        tags: ["my-rentals"],
      },
    });
    if (!response.ok) {
      return {
        success: false,
        data: [],
        message: "Failed to fetch rentals",
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,

      data: [],

      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
