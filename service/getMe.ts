"use server"
// Reads accessToken cookie, GET ${BACKEND_API_URL}/api/auth/me, forwarded as Cookie header. Returns {success:false} if not logged in rather than throwing, so callers can branch cleanly
