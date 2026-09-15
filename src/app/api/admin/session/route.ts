import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminPassword } from '@/lib/admin-auth';
import { writeAdminAudit } from '@/lib/admin-audit';
import { consumeRateLimit, resetRateLimit, resolveClientIp } from '@/lib/rate-limit';
import { env } from '@/utils/env';

const schema = z.object({ username: z.string().trim().min(1).max(80), password: z.string().min(1).max(256) });
export async function POST(req: NextRequest) {
  if (req.headers.get('origin') !== req.nextUrl.origin) return NextResponse.json({ error: 'Origem não autorizada.' }, { status: 403 });
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD_SCRYPT || !env.ADMIN_SESSION_SECRET) return NextResponse.json({ error: 'O acesso administrativo não foi configurado.' }, { status: 503 });
  const key = `admin-login:${resolveClientIp(req.headers)}`; const rate = consumeRateLimit({ key, limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rate.allowed) return NextResponse.json({ error: 'Muitas tentativas. Aguarde 15 minutos.' }, { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || parsed.data.username !== env.ADMIN_USERNAME || !verifyAdminPassword(parsed.data.password, env.ADMIN_PASSWORD_SCRYPT)) return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401 });
  resetRateLimit(key);
  const token = jwt.sign({ purpose: 'dashboard' }, env.ADMIN_SESSION_SECRET, { algorithm: 'HS256', issuer: 'gs-certificates', audience: 'dashboard', subject: env.ADMIN_USERNAME, expiresIn: '8h', jwtid: randomUUID() });
  await writeAdminAudit({
    category: 'authentication',
    event: 'admin.login.succeeded',
    actorType: 'admin',
    actorLabel: env.ADMIN_USERNAME,
  });
  const response = NextResponse.json({ ok: true }); response.cookies.set('admin_session', token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 28800, path: '/' }); return response;
}

export async function DELETE(req: NextRequest) {
  if (req.headers.get('origin') !== req.nextUrl.origin) {
    return NextResponse.json({ error: 'Origem não autorizada.' }, { status: 403 });
  }

  await writeAdminAudit({
    category: 'authentication',
    event: 'admin.logout',
    actorType: 'admin',
    actorLabel: env.ADMIN_USERNAME ?? null,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
  return response;
}
