"use server"
// GET ${BACKEND_API_URL}/api/gear/:id — next.tags:['gear-detail-'+id]


const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:5000";


export async function getGearById(id: string) {

  try {

    if (!id) {
      return {
        success: false,
        data: null,
        message: "Gear id is required",
      };
    }


    const response = await fetch(
      `${BACKEND_API_URL}/api/gear/${id}`,
      {
        method: "GET",
        cache: "no-store",
        next: {
          tags: [`gear-detail-${id}`],
        },
      }
    );


    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: "Failed to fetch gear details",
      };
    }


    return await response.json();


  } catch (error) {

    return {
      success: false,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };

  }
}