import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http';
import { clearAuthCookie } from '@/lib/cookies';
import type { CurrentUser } from '@/features/auth/types';

export async function GET() {
  // GET /users/me funciona pra qualquer papel autenticado — ao contrário de
  // /super-admin/users (só SUPERADMIN), que derrubaria a sessão de qualquer
  // outro usuário com um 403 interpretado como "token inválido".
  const { status, ok, data } = await apiFetch<CurrentUser>('/users/me');

  if (!ok) {
    // 401 = token ausente/expirado/inválido — a sessão realmente não existe mais.
    // Qualquer outro erro (ex: 500 temporário na API) não deve deslogar o usuário.
    if (status === 401) {
      await clearAuthCookie();
    }
    return NextResponse.json({ user: null }, { status });
  }

  return NextResponse.json({ user: data });
}
