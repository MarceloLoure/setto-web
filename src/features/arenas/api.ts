import type {
  ArenaListItem,
  ArenaDetail,
  OperatingHourSchedule,
  Holiday,
  CreateArenaPayload,
  ArenaDashboardSummary,
  DashboardPeriod,
} from './types';

interface PaginatedArenas {
  data: ArenaListItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

async function parseOrThrow<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || 'Ocorreu um erro na requisição.');
  }
  return data as T;
}

export const arenasApi = {
  async list(params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedArenas> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);

    const response = await fetch(`/api/arenas?${query.toString()}`, { cache: 'no-store' });
    return parseOrThrow(response);
  },

  async getById(arenaId: string): Promise<ArenaDetail> {
    const response = await fetch(`/api/arenas/${arenaId}`, { cache: 'no-store' });
    return parseOrThrow(response);
  },

  /** Cadastro de nova arena — promove o usuário logado a ARENA_ADMIN */
  async becomeAdmin(payload: CreateArenaPayload): Promise<ArenaDetail> {
    const response = await fetch('/api/arenas/become-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseOrThrow(response);
  },

  /** payload deve ser um FormData — campos de texto + logo/cover/photos (arquivos) */
  async update(arenaId: string, payload: FormData): Promise<ArenaDetail> {
    const response = await fetch(`/api/arenas/${arenaId}`, { method: 'PATCH', body: payload });
    return parseOrThrow(response);
  },

  async removePhoto(arenaId: string, photoUrl: string): Promise<void> {
    const response = await fetch(`/api/arenas/${arenaId}/photos?photoUrl=${encodeURIComponent(photoUrl)}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.message || 'Falha ao remover foto.');
    }
  },

  async toggleFollow(arenaId: string): Promise<{ isFollowing: boolean }> {
    const response = await fetch(`/api/arenas/${arenaId}/follow`, { method: 'POST' });
    return parseOrThrow(response);
  },

  async getOperatingHours(arenaId: string): Promise<{ schedules: OperatingHourSchedule[] }> {
    const response = await fetch(`/api/arenas/${arenaId}/operating-hours`, { cache: 'no-store' });
    return parseOrThrow(response);
  },

  async updateOperatingHours(
    arenaId: string,
    schedules: OperatingHourSchedule[],
  ): Promise<{ schedules: OperatingHourSchedule[] }> {
    const response = await fetch(`/api/arenas/${arenaId}/operating-hours`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedules }),
    });
    return parseOrThrow(response);
  },

  async getHolidays(arenaId: string): Promise<{ holidays: Holiday[] }> {
    const response = await fetch(`/api/arenas/${arenaId}/holidays`, { cache: 'no-store' });
    return parseOrThrow(response);
  },

  async createHoliday(arenaId: string, date: string, description?: string): Promise<Holiday> {
    const response = await fetch(`/api/arenas/${arenaId}/holidays`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, description }),
    });
    return parseOrThrow(response);
  },

  async removeHoliday(arenaId: string, holidayId: string): Promise<void> {
    const response = await fetch(`/api/arenas/${arenaId}/holidays/${holidayId}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.message || 'Falha ao remover fechamento.');
    }
  },

  async getDashboardSummary(
    arenaId: string,
    period: DashboardPeriod,
    date: string,
  ): Promise<ArenaDashboardSummary> {
    const response = await fetch(`/api/arenas/${arenaId}/dashboard?period=${period}&date=${date}`, {
      cache: 'no-store',
    });
    return parseOrThrow(response);
  },
};
