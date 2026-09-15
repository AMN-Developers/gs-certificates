'use server';

import { createServerAction } from 'zsa';
import { z } from 'zod';
import { UsersService } from '@/services/usersService';
import { cookies } from 'next/headers';
import { resolveDashboardAdminContext } from './dashboard/_admin-auth';

export const loginByClientId = createServerAction()
  .input(
    z.object({
      clientId: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { clientId } = input;
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    const usersService = new UsersService();
    const token = await usersService.retrieveUserById(parseInt(clientId));
    if (!token || typeof token !== 'string' || token.length === 0) {
      throw new Error('Error logging in user');
    }

    (await cookies()).set('token', token, {
      httpOnly: true,
    });

    return {
      message: 'User logged in successfully',
      token,
    };
  });

export const logout = createServerAction().handler(async () => {
  (await cookies()).set('token', '', {
    httpOnly: true,
  });

  return {
    message: 'User logged out successfully',
  };
});

export const getSessionAccess = createServerAction().handler(async () => {
  const admin = await resolveDashboardAdminContext();
  const isAdmin = !!admin;
  const canManageAdministrators =
    admin?.role === 'owner' && admin.actor === 'gsadmin';
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return {
      isAuthenticated: false,
      isAdmin,
      canManageAdministrators,
    };
  }

  const usersService = new UsersService();
  const user = await usersService.verifyToken(token).catch(() => null);

  if (!user) {
    return {
      isAuthenticated: false,
      isAdmin,
    };
  }

  return {
    isAuthenticated: true,
    isAdmin,
    canManageAdministrators,
  };
});
