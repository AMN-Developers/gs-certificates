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
        certificateTokens: {
          select: {
            higienizacao: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado!');
    }

    return UserDTO.fromDb(user.id, user.certificateTokens);
  }

  async createUser(userData: {
    userId: number;
    certificateTokens: { [key: string]: number };
  }) {
    const { userId, certificateTokens } = userData;

    const user = await this.db.user.create({
      data: {
        id: userId,
        certificateTokens: {
          create: {
            higienizacao: certificateTokens.higienizacao,
          },
        },
      },
    });

    return UserDTO.fromDb(user.id);
  }

  async updateTokenQuantity(userData: {
    userId: number;
    certificateTokens: { [key: string]: number };
  }) {
    const { userId, certificateTokens } = userData;

    const user = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        certificateTokens: {
          update: {
            [Object.keys(certificateTokens)[0]]: certificateTokens.higienizacao,
          },
        },
      },
    });

    return UserDTO.fromDb(user.id);
  }
}
