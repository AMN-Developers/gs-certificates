import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { env } from '@/utils/env';

type TDashboardAdminContext = { actor: string; userId: null };

export const resolveDashboardAdminContext =
  async (): Promise<TDashboardAdminContext | null> => {
    const token = (await cookies()).get('admin_session')?.value;
    if (!token || !env.ADMIN_USERNAME || !env.ADMIN_SESSION_SECRET) return null;
    try {
      const session = jwt.verify(token, env.ADMIN_SESSION_SECRET, { algorithms: ['HS256'], issuer: 'gs-certificates', audience: 'dashboard' }) as jwt.JwtPayload;
      return session.purpose === 'dashboard' && session.sub === env.ADMIN_USERNAME ? { actor: env.ADMIN_USERNAME, userId: null } : null;
    } catch { return null; }
  };
