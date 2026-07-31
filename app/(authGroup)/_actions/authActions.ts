"use server"
// loginAction(prevState, formData) and registerAction(prevState, formData) — POST to ${BACKEND_API_URL}/api/auth/login|register, on success sets httpOnly accessToken cookie (and refreshToken if the backend issues one), decodes role via utils/jwt.ts, redirects to /dashboard | /provider-dashboard | /admin-dashboard accordingly
