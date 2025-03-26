import { UsersRepository } from '@/repositories/userRepository';
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
    const userRepository = new UsersRepository();

    const user = await userService.verifyToken(token);

    if (!user) {
      redirect('/');
    }

    const certificateTokens = await userRepository.findTokenBalancesByUserId(
      user.id,
    );

    return {
      userId: user.id,
      certificateTokens,
    };
  },
);
