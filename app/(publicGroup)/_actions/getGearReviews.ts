"use server"
// GET ${BACKEND_API_URL}/api/gear/:id/reviews
"use server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:5000";


export async function getGearReviews(id: string) {

  try {

    if (!id) {
      return {
        success: false,
        data: [],
        message: "Gear id is required",
      };
    }


    const response = await fetch(
      `${BACKEND_API_URL}/api/gear/${id}/reviews`,
      {
        method: "GET",
        cache: "force-cache",
        next: {
          tags: [`gear-reviews-${id}`],
        },
      }
    );


    if (!response.ok) {
      return {
        success: false,
        data: [],
        message: "Failed to fetch gear reviews",
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