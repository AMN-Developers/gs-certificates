import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveDashboardAdminContext } from '@/app/dashboard/_admin-auth';
import { createAdminPasswordHash, verifyAdminPassword } from '@/lib/admin-auth';
import { writeAdminAudit } from '@/lib/admin-audit';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';

const schema = z.object({
  currentPassword: z.string().min(1).max(256),
  newPassword: z.string().min(12).max(256),
});

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) {
    return NextResponse.json(
      { error: 'Origem não autorizada.' },
      { status: 403 },
    );
  }

  const admin = await resolveDashboardAdminContext();

  if (!admin) {
    return NextResponse.json(
      { error: 'Acesso administrativo necessário.' },
      { status: 401 },
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'A nova senha deve ter ao menos 12 caracteres.' },
      { status: 400 },
    );
  }

  const [current] = await db
    .select({ passwordHash: adminUsers.passwordHash })
    .from(adminUsers)
    .where(eq(adminUsers.id, admin.id))
    .limit(1);

  if (
    !current ||
    !verifyAdminPassword(parsed.data.currentPassword, current.passwordHash)
  ) {
    return NextResponse.json(
      { error: 'Senha atual inválida.' },
      { status: 401 },
    );
  }

  await db
    .update(adminUsers)
    .set({
      passwordHash: createAdminPasswordHash(parsed.data.newPassword),
      mustChangePassword: false,
      passwordChangedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, admin.id));

  await writeAdminAudit({
    category: 'authentication',
    event: 'admin.password.changed',
    actorType: 'admin',
    actorId: admin.id,
    actorLabel: admin.actor,
    resourceType: 'admin_user',
    resourceId: String(admin.id),
  });

  return NextResponse.json({ ok: true });
}
