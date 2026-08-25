import { proxyToApi } from '@/lib/proxy';

export async function POST(request: Request, { params }: { params: Promise<{ arenaId: string }> }) {
  const { arenaId } = await params;
  return proxyToApi(request, `/arenas/${arenaId}/toggle-follow`);
}
