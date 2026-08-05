"use server";

import { cookies } from "next/headers";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:5000";

export async function getMe() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        data: null,
        message: "Not authenticated",
      };
    }

    const response = await fetch(`${BACKEND_API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const result = await response.json();


    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: result.message ?? "Unauthorized",
      };
    }

    return result;
  } catch (error) {
    
    return {
      success: false,
      data: null,
      message: "Server error",
    };
  }
}