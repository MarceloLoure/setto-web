export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH';
export type PaymentCategory = 'BOOKING' | 'BAR_SNACKBAR' | 'EQUIPMENT_RENTAL' | 'SPONSORSHIP' | 'OTHER';
export type PaymentStatus = 'COMPLETED' | 'PENDING';

export interface Payment {
  id: string;
  description: string;
  amount: string;
  method: PaymentMethod;
  category: PaymentCategory;
  status: PaymentStatus;
  paidAt: string;
  arenaId: string;
  bookingId: string | null;
  booking: { id: string; startTime: string; court: { name: string } } | null;
  user: { name: string } | null;
  createdBy: { name: string };
}

export interface CreatePaymentPayload {
  description: string;
  amount: number;
  method: PaymentMethod;
  category?: PaymentCategory;
  arenaId: string;
  bookingId?: string;
  userId?: string;
}
