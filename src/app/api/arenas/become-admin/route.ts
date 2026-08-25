import { NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http';
import { setAuthCookie } from '@/lib/cookies';

export async function POST(request: Request) {
  const body = await request.text();
  const { status, ok, data } = await apiFetch<{ accessToken: string; arena: unknown }>(
    '/arenas/become-admin',
    { method: 'POST', body },
  );

  if (!ok) {
    return NextResponse.json(data, { status });
  }

  // O papel do usuário mudou pra ARENA_ADMIN — o cookie precisa ser atualizado
  // com o token novo, senão as próximas chamadas (criar quadra, editar arena)
  // ainda usariam o token antigo com role: ATHLETE e levariam 403.
  await setAuthCookie(data.accessToken);

  return NextResponse.json(data.arena);
}
