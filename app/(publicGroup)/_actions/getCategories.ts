"use server"
// GET ${BACKEND_API_URL}/api/categories — long revalidate window, categories rarely change
const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:5000";


export async function getCategories() {
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/api/categories`,
      {
        method: "GET",
        cache: "force-cache",
        next: {
          tags: ["categories"],
        },
      }
    );


    if (!response.ok) {
      return {
        success: false,
        data: [],
        message: "Failed to fetch categories",
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