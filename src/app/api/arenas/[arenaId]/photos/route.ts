import { proxyToApi } from '@/lib/proxy';

export async function DELETE(request: Request, { params }: { params: Promise<{ arenaId: string }> }) {
  const { arenaId } = await params;
  return proxyToApi(request, `/arenas/${arenaId}/photos`);
}
