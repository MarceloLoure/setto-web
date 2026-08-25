import type {
  Booking,
  CreateAppBookingPayload,
  CreateManagerBookingPayload,
  ArenaAvailability,
} from './types';

async function parseOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Ocorreu um erro na requisição.');
  }
  return data as T;
}

export const bookingsApi = {
  async list(params: { arenaId?: string; courtId?: string } = {}): Promise<Booking[]> {
    const query = new URLSearchParams();
    if (params.arenaId) query.set('arenaId', params.arenaId);
    if (params.courtId) query.set('courtId', params.courtId);

    const response = await fetch(`/api/bookings?${query.toString()}`, { cache: 'no-store' });
    return parseOrThrow(response);
  },

  /** Reserva feita pelo próprio atleta (app/web do usuário final) */
  async createOwn(payload: CreateAppBookingPayload): Promise<Booking> {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseOrThrow(response);
  },

  /** Reserva de balcão/aula/campeonato criada pela gestão (ARENA_ADMIN/RECEPTIONIST) */
  async createManaged(payload: CreateManagerBookingPayload): Promise<Booking> {
    const response = await fetch('/api/manager/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseOrThrow(response);
  },

  async cancel(bookingId: string): Promise<void> {
    const response = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PATCH' });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.message || 'Falha ao cancelar reserva.');
    }
  },

  async getAvailability(arenaId: string, date: string): Promise<ArenaAvailability> {
    const response = await fetch(`/api/arenas/${arenaId}/availability?date=${date}`, { cache: 'no-store' });
    return parseOrThrow(response);
  },

  async listManaged(params: { arenaId: string; startDate: string; endDate: string }): Promise<Booking[]> {
    const query = new URLSearchParams(params);
    const response = await fetch(`/api/manager/bookings?${query.toString()}`, { cache: 'no-store' });
    return parseOrThrow(response);
  },
};
