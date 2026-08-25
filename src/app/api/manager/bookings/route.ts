import { proxyToApi } from '@/lib/proxy';

export async function GET(request: Request) {
  return proxyToApi(request, '/manager/bookings');
}

export async function POST(request: Request) {
  return proxyToApi(request, '/manager/bookings');
}
