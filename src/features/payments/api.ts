import type { Payment, CreatePaymentPayload } from './types';

async function parseOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Ocorreu um erro na requisição.');
  }
  return data as T;
}

export const paymentsApi = {
  async listByArena(arenaId: string): Promise<Payment[]> {
    const response = await fetch(`/api/payments/arena/${arenaId}`, { cache: 'no-store' });
    return parseOrThrow(response);
  },

  async create(payload: CreatePaymentPayload): Promise<Payment> {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseOrThrow(response);
  },
};
