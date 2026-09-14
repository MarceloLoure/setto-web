import type { LandingPageData, CheckoutArenaPayload, CheckoutArenaResult } from './types';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
    const response = await fetch(`${BACKEND_URL}/public/landing-page`, {
      next: { revalidate: 3600 },
    });
    
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
