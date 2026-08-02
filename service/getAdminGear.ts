"use server"
// GET /api/admin/gear (Cookie-forwarded)


import { cookies } from "next/headers";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:5000";

export async function getAdminGear() {
  try {
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        data: [],
        message: "Unauthorized",
      };
    }

    const response = await fetch(
      `${BACKEND_API_URL}/api/admin/gear`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: [],
        message:
          result.message || "Failed to fetch gear",
      };
    }

    return result;

  } catch (error) {
    return {
      success: false,
      data: [],
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
}