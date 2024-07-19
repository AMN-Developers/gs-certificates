import jwt from 'jsonwebtoken';
import { UserDTO } from '@/dtos/user';
import { IUsersRepository } from '@/repositories';
import { UsersRepository } from '@/repositories/userRepository';
import { env } from '@/utils/env';

export class UsersService {
  private usersRepository: IUsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async retrieveUserById(userId: number) {
    const userFromDb = await this.usersRepository.retrieveUserById(
      new UserDTO(userId),
    );

    if (!userFromDb) {
      throw new Error('Usuário não encontrado!');
    }
    const token = jwt.sign(
      {
        userId: userFromDb.userId,
      },
      env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return token;
  }

  async verifyToken(token: string) {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number };

    if (!decoded) {
      throw new Error('Invalid token');
    }

    const user = await this.usersRepository.retrieveUserById(
      new UserDTO(decoded.userId),
    );

    return user;
  }
}
