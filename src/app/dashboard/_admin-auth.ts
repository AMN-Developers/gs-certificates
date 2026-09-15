import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { env } from '@/utils/env';

export type DashboardAdminContext = {
  id: number;
  actor: string;
  role: 'owner' | 'admin';
  userId: null;
};

export const resolveDashboardAdminContext =
  async (): Promise<DashboardAdminContext | null> => {
    const token = (await cookies()).get('admin_session')?.value;

    if (!token || !env.ADMIN_SESSION_SECRET) {
      return null;
    }

    try {
      const session = jwt.verify(token, env.ADMIN_SESSION_SECRET, {
        algorithms: ['HS256'],
        issuer: 'gs-certificates',
        audience: 'dashboard',
      }) as jwt.JwtPayload;

      if (session.purpose !== 'dashboard' || !session.sub) {
        return null;
      }

      const id = Number(session.sub);

      if (!Number.isInteger(id) || id <= 0) {
        return null;
      }

      const [admin] = await db
        .select({
          id: adminUsers.id,
          username: adminUsers.username,
          role: adminUsers.role,
        })
        .from(adminUsers)
        .where(and(eq(adminUsers.id, id), eq(adminUsers.active, true)))
        .limit(1);

      if (!admin || (admin.role !== 'owner' && admin.role !== 'admin')) {
        return null;
      }

      return {
        id: admin.id,
        actor: admin.username,
        role: admin.role,
        userId: null,
      };
    } catch {
      return null;
    }
  };

export async function requireOwnerAdmin() {
  const admin = await resolveDashboardAdminContext();
  return admin?.role === 'owner' ? admin : null;
}
