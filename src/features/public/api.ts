import type { LandingPageData, CheckoutArenaPayload, CheckoutArenaResult } from './types';

async function parseOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new Error(message || 'Ocorreu um erro na requisição.');
  }
  return data as T;
}

export const publicApi = {
  async getLandingPageData(): Promise<LandingPageData> {
    const response = await fetch('/api/public/landing-page', { cache: 'no-store' });
    return parseOrThrow(response);
  },

  async checkoutArena(payload: CheckoutArenaPayload): Promise<CheckoutArenaResult> {
    const response = await fetch('/api/public/checkout-arena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseOrThrow(response);
  },
};
