"use server"
import { cookies } from 'next/headers';
import type { User } from '@/lib/types';


interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'PROVIDER';
  phone?: string;
}

type RegisterResult =
  | { success: true; data: { user: User; token: string } }
  | { success: false; message: string };

export async function registerAction(input: RegisterInput): Promise<RegisterResult> {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Registration failed' };
    }

    const cookieStore = await cookies();
    cookieStore.set('accessToken', result.data.token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true, data: result.data };
  } catch {
    return { success: false, message: 'Could not reach the server. Please try again.' };
  }
}





// login functionality
interface LoginInput {
  email: string;
  password: string;
}

type LoginResult =
  | { success: true; data: { user: User; token: string } }
  | { success: false; message: string };

export async function loginAction(input: LoginInput): Promise<LoginResult> {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return { success: false, message: result.message ?? 'Invalid email or password' };
    }

    const cookieStore = await cookies();
    cookieStore.set('accessToken', result.data.token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true, data: result.data };
  } catch {
    return { success: false, message: 'Could not reach the server. Please try again.' };
  }
}