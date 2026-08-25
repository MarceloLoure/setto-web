import { NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await apiResponse.json().catch(() => ({}));

    if (!apiResponse.ok) {
      const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
      return NextResponse.json({ message: message || 'Falha ao autenticar.' }, { status: apiResponse.status });
    }

    await setAuthCookie(data.accessToken);

    // Não repassamos o "user" parcial que /auth/login devolve — o AuthContext
    // sempre busca o perfil completo via /api/auth/me (GET /users/me) logo em
    // seguida, então aqui só confirmamos que a sessão foi criada.
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Erro interno ao processar autenticação.' }, { status: 500 });
  }
}
