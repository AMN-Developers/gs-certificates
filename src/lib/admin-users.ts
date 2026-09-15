import { count, eq } from 'drizzle-orm';
import { createAdminPasswordHash } from '@/lib/admin-auth';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { env } from '@/utils/env';

export type AdminRole = 'owner' | 'admin';

export async function bootstrapFirstAdmin() {
  if (
    !env.ADMIN_USERNAME ||
    !env.ADMIN_PASSWORD_SCRYPT ||
    !env.ADMIN_SESSION_SECRET
  ) {
    return;
  }

  const [result] = await db.select({ total: count() }).from(adminUsers);

  if (Number(result.total) > 0) {
    return;
  }

  await db
    .insert(adminUsers)
    .values({
      username: env.ADMIN_USERNAME,
      passwordHash: env.ADMIN_PASSWORD_SCRYPT,
      role: 'owner',
      active: true,
      mustChangePassword: false,
    })
    .onConflictDoNothing();
}

export async function findActiveAdminByUsername(username: string) {
  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  return admin?.active ? admin : null;
}

export async function createAdminUser(input: {
  username: string;
  password: string;
  role?: AdminRole;
}) {
  const [admin] = await db
    .insert(adminUsers)
    .values({
      username: input.username,
      passwordHash: createAdminPasswordHash(input.password),
      role: input.role ?? 'admin',
      active: true,
      mustChangePassword: true,
    })
    .returning();

  return admin;
}
