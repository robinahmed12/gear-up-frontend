'use server';

/**
 * Calls the backend's refresh endpoint using the refresh token, returning
 * a fresh access token. Called from proxy.ts when the access token has
 * expired but the refresh token is still valid — keeps the user logged in
 * without forcing a re-login on every access-token expiry.
 *
 * Adjust the endpoint path to match your actual GearUp backend's refresh
 * route once it exists (this scaffold assumes POST /api/auth/refresh).
 */
export const getNewAccessToken = async (
  refreshToken: string,
): Promise<
  | { success: true; data: { accessToken: string } }
  | { success: false; message: string }
> => {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const result = await res.json();

    if (!res.ok || !result?.data?.accessToken) {
      return { success: false, message: result?.message ?? 'Failed to refresh token' };
    }

    return { success: true, data: { accessToken: result.data.accessToken } };
  } catch {
    return { success: false, message: 'Failed to reach the backend to refresh the token' };
  }
};
