"use server";
// GET /api/admin/users (Cookie-forwarded)

import { cookies } from "next/headers";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

export async function getAdminUsers(search = "", page = 1, limit = 10) {
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
    const params = new URLSearchParams();

    if (search.trim().length > 0) {
      params.set("search", search.trim());
    }

    params.set("page", page.toString());
    params.set("limit", limit.toString());

    const response = await fetch(
      `${BACKEND_API_URL}/api/admin/users?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: [],
        message: data.message,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
