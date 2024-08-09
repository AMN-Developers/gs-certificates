/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createServerAction } from 'zsa';
import { z } from 'zod';
import { UsersService } from '@/services/usersService';
import { cookies } from 'next/headers';

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

    cookies().set('token', token, {
      httpOnly: true,
    });

    return {
      message: 'User logged in successfully',
      token,
    };
  });

export const logout = createServerAction().handler(() => {
  cookies().set('token', '', {
    httpOnly: true,
  });

  return {
    message: 'User logged out successfully',
  };
});
