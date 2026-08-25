import { NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await apiResponse.json().catch(() => ({}));

    if (!apiResponse.ok) {
      const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
      return NextResponse.json({ message: message || 'Falha ao cadastrar.' }, { status: apiResponse.status });
    }

    await setAuthCookie(data.accessToken);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Erro interno ao processar cadastro.' }, { status: 500 });
  }
}
