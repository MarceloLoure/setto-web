import { proxyToApi } from '@/lib/proxy';

export async function GET(request: Request, { params }: { params: Promise<{ arenaId: string }> }) {
  const { arenaId } = await params;
  return proxyToApi(request, `/arenas/${arenaId}/holidays`);
}

export async function POST(request: Request, { params }: { params: Promise<{ arenaId: string }> }) {
  const { arenaId } = await params;
  return proxyToApi(request, `/arenas/${arenaId}/holidays`);
}
