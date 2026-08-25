import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from './http';

export async function setAuthCookie(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true, // inacessível via JS no browser — protege contra roubo de token via XSS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias — deve bater com a expiração do JWT na API
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
