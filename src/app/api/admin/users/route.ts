import { and, asc, eq, ne } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  requireOwnerAdmin,
} from '@/app/dashboard/_admin-auth';
import { createAdminPasswordHash, verifyAdminPassword } from '@/lib/admin-auth';
import { writeAdminAudit } from '@/lib/admin-audit';
import { createAdminUser } from '@/lib/admin-users';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';

const createSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9._-]{3,80}$/),
  password: z.string().min(12).max(256),
});

const updateSchema = z.object({
  id: z.number().int().positive(),
  action: z.enum(['reset_password', 'set_active']),
  password: z.string().min(12).max(256).optional(),
  active: z.boolean().optional(),
});

function sameOrigin(request: NextRequest) {
  return request.headers.get('origin') === request.nextUrl.origin;
}

export async function GET() {
  const owner = await requireOwnerAdmin();

  if (!owner) {
    return NextResponse.json(
      { error: 'Acesso de proprietário necessário.' },
      { status: 403 },
    );
  }

  const items = await db
    .select({
      id: adminUsers.id,
      username: adminUsers.username,
      role: adminUsers.role,
      active: adminUsers.active,
      mustChangePassword: adminUsers.mustChangePassword,
      lastLoginAt: adminUsers.lastLoginAt,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(asc(adminUsers.username));

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json(
      { error: 'Origem não autorizada.' },
      { status: 403 },
    );
  }

  const owner = await requireOwnerAdmin();

  if (!owner) {
    return NextResponse.json(
      { error: 'Acesso de proprietário necessário.' },
      { status: 403 },
    );
  }

  const parsed = createSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          'Informe um usuário válido e uma senha temporária de ao menos 12 caracteres.',
      },
      { status: 400 },
    );
  }

  try {
    const admin = await createAdminUser(parsed.data);

    await writeAdminAudit({
      category: 'authentication',
      event: 'admin.user.created',
      actorType: 'admin',
      actorId: owner.id,
      actorLabel: owner.actor,
      resourceType: 'admin_user',
      resourceId: String(admin.id),
      details: { username: admin.username },
    });

    return NextResponse.json(
      {
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
          active: admin.active,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'Esse usuário administrativo já existe.' },
        { status: 409 },
      );
    }

    throw error;
  }
}

export async function PATCH(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json(
      { error: 'Origem não autorizada.' },
      { status: 403 },
    );
  }

  const owner = await requireOwnerAdmin();

  if (!owner) {
    return NextResponse.json(
      { error: 'Acesso de proprietário necessário.' },
      { status: 403 },
    );
  }

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }

  const input = parsed.data;
  const [target] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, input.id))
    .limit(1);

  if (!target) {
    return NextResponse.json(
      { error: 'Administrador não encontrado.' },
      { status: 404 },
    );
  }

  if (target.id === owner.id) {
    return NextResponse.json(
      { error: 'Use “Minha senha” para alterar a sua própria conta.' },
      { status: 422 },
    );
  }

  if (input.action === 'reset_password') {
    if (!input.password) {
      return NextResponse.json(
        { error: 'Informe uma senha temporária de ao menos 12 caracteres.' },
        { status: 400 },
      );
    }

    await db
      .update(adminUsers)
      .set({
        passwordHash: createAdminPasswordHash(input.password),
        mustChangePassword: true,
        passwordChangedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, target.id));
  }

  if (input.action === 'set_active') {
    if (typeof input.active !== 'boolean') {
      return NextResponse.json(
        { error: 'Informe o novo status da conta.' },
        { status: 400 },
      );
    }

    await db
      .update(adminUsers)
      .set({ active: input.active, updatedAt: new Date() })
      .where(and(eq(adminUsers.id, target.id), ne(adminUsers.id, owner.id)));
  }

  await writeAdminAudit({
    category: 'authentication',
    event:
      input.action === 'reset_password'
        ? 'admin.user.password_reset'
        : input.active
          ? 'admin.user.activated'
          : 'admin.user.deactivated',
    actorType: 'admin',
    actorId: owner.id,
    actorLabel: owner.actor,
    resourceType: 'admin_user',
    resourceId: String(target.id),
    details: { username: target.username },
  });

  return NextResponse.json({ ok: true });
}
