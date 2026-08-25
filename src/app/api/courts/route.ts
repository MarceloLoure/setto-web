import { proxyToApi } from '@/lib/proxy';

export async function POST(request: Request) {
  // multipart/form-data (fotos da quadra) — repassado como corpo bruto
  return proxyToApi(request, '/courts');
}
