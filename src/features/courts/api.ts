import type { Court } from './types';

async function parseOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Ocorreu um erro na requisição.');
  }
  return data as T;
}

export const courtsApi = {
  async listByArena(arenaId: string, onlyActive = false): Promise<Court[]> {
    const query = onlyActive ? '?onlyActive=true' : '';
    const response = await fetch(`/api/courts/arena/${arenaId}${query}`, { cache: 'no-store' });
    return parseOrThrow(response);
  },

  async getById(courtId: string): Promise<Court> {
    const response = await fetch(`/api/courts/${courtId}`, { cache: 'no-store' });
    return parseOrThrow(response);
  },

  /** payload deve ser um FormData (name, sport, hourlyRate, isCovered, arenaId, photos[]) */
  async create(payload: FormData): Promise<Court> {
    const response = await fetch('/api/courts', { method: 'POST', body: payload });
    return parseOrThrow(response);
  },

  async update(courtId: string, payload: FormData): Promise<Court> {
    const response = await fetch(`/api/courts/${courtId}`, { method: 'PATCH', body: payload });
    return parseOrThrow(response);
  },

  async remove(courtId: string): Promise<void> {
    const response = await fetch(`/api/courts/${courtId}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.message || 'Falha ao remover quadra.');
    }
  },
};
