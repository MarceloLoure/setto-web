import { proxyToApi } from '@/lib/proxy';

export async function PATCH(request: Request, { params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return proxyToApi(request, `/bookings/${bookingId}/cancel`);
}
