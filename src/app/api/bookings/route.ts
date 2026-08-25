import { proxyToApi } from '@/lib/proxy';

export async function GET(request: Request) {
  return proxyToApi(request, '/bookings');
}

export async function POST(request: Request) {
  return proxyToApi(request, '/bookings');
}
