import { NextResponse } from 'next/server';
import { apiFetch } from './http';

/**
 * Encaminha o método/corpo/query da requisição pra API NestJS e devolve a
 * resposta tal como veio (status + body). Uso típico numa Route Handler:
 *
 *   export async function GET(req: Request) {
 *     return proxyToApi(req, '/arenas');
 *   }
 *
 * Passe `path` já com os parâmetros de rota resolvidos (ex: `/arenas/${arenaId}`).
 * A query string da requisição original é sempre repassada automaticamente.
 */
export async function proxyToApi(request: Request, path: string) {
  const { search } = new URL(request.url);
  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const contentType = request.headers.get('content-type') ?? undefined;
  const isMultipart = contentType?.startsWith('multipart/form-data');

  const { status, data } = await apiFetch(`${path}${search}`, {
    method: request.method,
    // multipart precisa ir como stream bruto (preserva boundary/binário);
    // qualquer outro corpo (JSON, ou nenhum) vai como texto.
    body: hasBody ? (isMultipart ? request.body : await request.text()) : undefined,
    headers: contentType ? { 'Content-Type': contentType } : undefined,
    // obrigatório pelo fetch do Node quando o body é um ReadableStream
    duplex: isMultipart ? 'half' : undefined,
  });

  return NextResponse.json(data, { status });
}
