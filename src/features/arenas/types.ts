import type { UserFile } from '@/features/auth/types';

export type Sport = 'BEACH_TENNIS' | 'FOOTVOLLEY' | 'VOLLEYBALL';

export interface CourtSummary {
  id: string;
  name: string;
  sport: Sport;
  hourlyRate: string; // Decimal do Prisma vem serializado como string
  isCovered: boolean;
  photos?: UserFile[];
}

/** Item da listagem GET /arenas */
export interface ArenaListItem {
  id: string;
  name: string;
  cnpj: string | null;
  logo: UserFile | null;
  photos: UserFile[];
  address: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  zipCode: string;
  city: string;
  state: string;
  isActive: boolean;
  totalActiveCourts: number;
  totalFollowers: number;
  isFollowing: boolean;
  courts: CourtSummary[];
}

/** Detalhe GET /arenas/:id — inclui cover além do que já vem na listagem */
export interface ArenaDetail extends ArenaListItem {
  cover: UserFile | null;
}

export interface OperatingHourSchedule {
  id?: string;
  dayOfWeek: number; // 0 = domingo ... 6 = sábado
  openTime: string; // "HH:mm"
  closeTime: string; // "HH:mm"
  isOpen: boolean;
}

export interface Holiday {
  id: string;
  date: string; // ISO
  description?: string | null;
}

export interface CreateArenaPayload {
  name: string;
  cnpj?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  zipCode?: string;
  city: string;
  state: string;
}

export interface UpdateArenaPayload {
  name?: string;
  cnpj?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  zipCode?: string;
  city?: string;
  state?: string;
}

export type DashboardPeriod = 'day' | 'week' | 'month';

export interface CourtDashboardSummary {
  courtId: string;
  courtName: string;
  sport: Sport;
  totalSlots: number;
  bookedSlots: number;
  freeSlots: number;
  occupancyRate: number;
  bookingsCount: number;
}

export interface ArenaDashboardSummary {
  arena: { id: string; name: string };
  period: DashboardPeriod;
  rangeStart: string;
  rangeEnd: string;
  bookings: { total: number; confirmed: number; cancelled: number; completed: number };
  revenue: {
    total: number;
    byMethod: Record<string, number>;
    byCategory: Record<string, number>;
  };
  courts: CourtDashboardSummary[];
}
