import { and, count, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { resolveDashboardAdminContext } from '@/app/dashboard/_admin-auth';
import { db } from '@/lib/db';
import { systemLogs } from '@/lib/db/schema';

export const runtime = 'nodejs';

const levels = ['info', 'warning', 'error'];
const categories = ['authentication', 'credits', 'operational'];

export async function GET(request: NextRequest) {
  if (!(await resolveDashboardAdminContext())) return NextResponse.json({ error: 'Acesso administrativo necessário.' }, { status: 401 });

  const page = Math.max(1, Number(request.nextUrl.searchParams.get('page')) || 1);
  const level = request.nextUrl.searchParams.get('level') || '';
  const category = request.nextUrl.searchParams.get('category') || '';
  const query = (request.nextUrl.searchParams.get('query') || '').trim().slice(0, 100);
  const conditions = [];
  if (levels.includes(level)) conditions.push(eq(systemLogs.level, level));
  if (categories.includes(category)) conditions.push(eq(systemLogs.category, category));
  if (query) conditions.push(or(ilike(systemLogs.event, `%${query}%`), ilike(systemLogs.resourceType, `%${query}%`), ilike(systemLogs.resourceId, `%${query}%`), ilike(systemLogs.actorLabel, `%${query}%`), sql`CAST(${systemLogs.actorId} AS TEXT) ILIKE ${`%${query}%`}`));
  const where = conditions.length ? and(...conditions) : undefined;
  const limit = 30;
  const [items, [summary]] = await Promise.all([
    db.select().from(systemLogs).where(where).orderBy(desc(systemLogs.createdAt)).limit(limit).offset((page - 1) * limit),
    db.select({ total: count() }).from(systemLogs).where(where),
  ]);
  return NextResponse.json({ items, page, pages: Math.max(1, Math.ceil(Number(summary.total) / limit)), total: Number(summary.total) }, { headers: { 'Cache-Control': 'no-store' } });
}
