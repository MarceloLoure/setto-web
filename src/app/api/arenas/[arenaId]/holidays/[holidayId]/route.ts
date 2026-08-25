import { proxyToApi } from '@/lib/proxy';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ arenaId: string; holidayId: string }> },
) {
  const { arenaId, holidayId } = await params;
  return proxyToApi(request, `/arenas/${arenaId}/holidays/${holidayId}`);
}
