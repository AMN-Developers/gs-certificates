import { UsersService } from '@/services/usersService';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerActionProcedure } from 'zsa';

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    const token = cookies().get('token')?.value;

    if (!token) {
      throw new Error('Não autorizado!');
    }

    const userService = new UsersService();

    const user = await userService.verifyToken(token);

    if (!user) {
      redirect('/');
    }

    return user;
  },
);
