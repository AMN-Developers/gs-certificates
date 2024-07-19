import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma/client';
import { UserDTO } from '@/dtos/user';
import { IUsersRepository } from '.';

export class UsersRepository implements IUsersRepository {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async retrieveUserById(userData: UserDTO) {
    const { userId } = userData;

    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado!');
    }

    return UserDTO.fromDb(user.id);
  }
}
