"use server";
import { cookies } from "next/headers";
import type { User } from "@/lib/types";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "PROVIDER";
  phone?: string;
}

type RegisterResult =
  | { success: true; data: { user: User; token: string; refreshToken: string } }
  | { success: false; message: string };

export async function registerAction(
  input: RegisterInput,
): Promise<RegisterResult> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
    );

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message ?? "Registration failed",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("accessToken", result.data.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
}

// login functionality
interface LoginInput {
  email: string;
  password: string;
}

type LoginResult =
  | { success: true; data: { user: User; token: string; refreshToken: string } }
  | { success: false; message: string };

export async function loginAction(input: LoginInput): Promise<LoginResult> {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message ?? "Invalid email or password",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("accessToken", result.data.token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return { success: true, data: result.data };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
}

// Verify an email address using the token from the verification email.
export async function verifyEmailAction(
  token: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/verify-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      },
    );

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message ?? "Verification failed",
      };
    }

    return {
      success: true,
      message: result.message ?? "Email verified successfully",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
}

// Resend the verification email to the logged-in (still unverified) user.
export async function resendVerificationAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/resend-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message ?? "Could not resend verification email",
      };
    }

    return {
      success: true,
      message: result.message ?? "Verification email sent",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
}

// Request a password reset link for an email address.
export async function forgotPasswordAction(
  email: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    const result = await res.json();

    // Always success-shaped to avoid leaking which emails are registered.
    return {
      success: true,
      message:
        result.message ??
        "If an account with that email exists, a reset link has been sent.",
    };
  } catch {
    return {
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    };
  }
}

// Reset a password using the token from the reset email.
export async function resetPasswordAction(
  token: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      },
    );

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message ?? "Password reset failed",
      };
    }

    return {
      success: true,
      message:
        result.message ?? "Password reset successfully. Please log in again.",
    };
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
}
