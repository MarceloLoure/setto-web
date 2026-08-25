import { proxyToApi } from '@/lib/proxy';

export async function GET(request: Request, { params }: { params: Promise<{ courtId: string }> }) {
  const { courtId } = await params;
  return proxyToApi(request, `/courts/${courtId}`);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ courtId: string }> }) {
  const { courtId } = await params;
  return proxyToApi(request, `/courts/${courtId}`);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ courtId: string }> }) {
  const { courtId } = await params;
  return proxyToApi(request, `/courts/${courtId}`);
}
