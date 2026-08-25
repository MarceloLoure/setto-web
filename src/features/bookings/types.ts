export type BookingType =
  | 'FREE_PLAY'
  | 'SINGLE_LESSON'
  | 'GROUP_LESSON'
  | 'RECURRING_LESSON'
  | 'TOURNAMENT';

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  type: BookingType;
  status: BookingStatus;
  courtId: string;
  arenaId: string;
  userId: string | null;
  customerName: string | null;
  startTime: string;
  endTime: string;
  totalAmount: string;
  court: { id: string; name: string; sport: string; hourlyRate?: string; isCovered?: boolean };
  arena: { id: string; name: string };
  // Reservas de balcão (sem userId) não têm usuário vinculado — sempre checar antes de usar.
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatar?: { path: string } | null;
  } | null;
  clientDisplayName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
}

export interface CreateAppBookingPayload {
  courtId: string;
  startTime: string;
  endTime: string;
}

export interface CreateManagerBookingPayload extends CreateAppBookingPayload {
  type: BookingType;
  customerName?: string;
  userId?: string;
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  timeLabel: string;
  isAvailable: boolean;
  price: number;
}

export interface CourtAvailability {
  courtId: string;
  courtName: string;
  sport: string;
  isCovered: boolean;
  hourlyRate: number;
  availableSlotsCount: number;
  slots: AvailabilitySlot[];
}

export interface ArenaAvailability {
  arena: { id: string; name: string };
  date: string;
  isClosed: boolean;
  reason?: string;
  operatingWindow?: { openTime: string; closeTime: string };
  slotDurationMinutes?: number;
  courts: CourtAvailability[];
}
