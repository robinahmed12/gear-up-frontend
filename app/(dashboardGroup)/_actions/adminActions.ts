"use server"
// suspendUserAction/activateUserAction -> PATCH /api/admin/users/:id; createCategoryAction/updateCategoryAction/deleteCategoryAction -> /api/admin/categories[/:id]


import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const API =
  process.env.BACKEND_API_URL || "http://localhost:5000";

async function getToken() {
  const cookieStore = await cookies();

  return cookieStore.get("accessToken")?.value ?? null;
}

export async function suspendUserAction(id: string) {
  const token = await getToken();

  if (!token) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const response = await fetch(
    `${API}/api/admin/users/${id}`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status: "SUSPENDED",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message,
    };
  }

  revalidateTag("admin-users", "max");

  return data;
}

export async function activateUserAction(id: string) {
  const token = await getToken();

  if (!token) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const response = await fetch(
    `${API}/api/admin/users/${id}`,
    {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status: "ACTIVE",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message,
    };
  }

  revalidateTag("admin-users", "max");

  return data;
}