import { proxyToApi } from '@/lib/proxy';

export async function GET(request: Request) {
  return proxyToApi(request, '/arenas');
}
