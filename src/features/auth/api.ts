import type { CurrentUser, LoginCredentials, RegisterData } from './types';

async function parseOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Ocorreu um erro na requisição.');
  }
  return data as T;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: CurrentUser }> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return parseOrThrow(response);
  },

  async register(payload: RegisterData): Promise<{ user: CurrentUser }> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseOrThrow(response);
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  /**
   * Fonte de verdade da sessão: sempre pergunta pro servidor (que lê o cookie
   * httpOnly e valida contra GET /users/me na API) em vez de confiar em
   * estado local. Retorna null se não houver sessão válida.
   */
  async getCurrentUser(): Promise<CurrentUser | null> {
    const response = await fetch('/api/auth/me', { cache: 'no-store' });
    if (!response.ok) return null;
    const data = await response.json();
    return data.user ?? null;
  },
};
