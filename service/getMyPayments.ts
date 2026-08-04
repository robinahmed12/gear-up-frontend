"use server"
// GET /api/payments (Cookie-forwarded)

import { cookies } from "next/headers";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:5000";



export async function getMyPayments() {

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
      `${BACKEND_API_URL}/api/payments`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${accessToken}`,
        },

        cache: "no-store",
      }
    );



    if (!response.ok) {

      return {
        success: false,
        data: [],
        message:
          "Failed to fetch payments",
      };

    }



    return await response.json();



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