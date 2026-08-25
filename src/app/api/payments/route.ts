import { proxyToApi } from '@/lib/proxy';

export async function POST(request: Request) {
  return proxyToApi(request, '/payments');
}
