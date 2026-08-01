"use server"


import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Clears the auth cookies set at login and sends the user back to /login.
 * Used directly as a <form action={logoutAction}> target (Navbar), which
 * is why it takes no arguments — Server Actions used as form actions
 * receive FormData as their first param only if the function declares it.
 */
export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  redirect('/login');
}