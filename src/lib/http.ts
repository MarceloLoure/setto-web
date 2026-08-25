import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const AUTH_COOKIE_NAME = 'bsc_token';

/**
 * Wrapper único pra chamar a API NestJS a partir de código server-side
 * (Route Handlers dentro de src/app/api/*).
 *
 * Nunca importe isto num Client Component — ele usa next/headers, que só
 * funciona no servidor. Componentes client devem chamar as rotas locais
 * /api/* (que por sua vez usam isto aqui), nunca a API NestJS direto.
 */
export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit & { duplex?: 'half' } = {},
): Promise<{ status: number; ok: boolean; data: T }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  // Content-Type já vem definido em init.headers quando estamos repassando
  // uma requisição bruta (ex: multipart/form-data com boundary) — só aplicamos
  // o default de JSON quando nada foi especificado.
  const hasContentType =
    init.headers instanceof Headers
      ? init.headers.has('Content-Type')
      : Object.keys(init.headers || {}).some((h) => h.toLowerCase() === 'content-type');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(hasContentType ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    cache: 'no-store',
  } as RequestInit);

  const data = await response.json().catch(() => ({}) as T);

  return { status: response.status, ok: response.ok, data: data as T };
}

/** Helper pra devolver o mesmo formato de erro que a API NestJS já usa (message/error/statusCode). */
export function apiErrorBody(data: any, fallback: string) {
  const message = data?.message || fallback;
  return { message: Array.isArray(message) ? message.join(', ') : message };
}
