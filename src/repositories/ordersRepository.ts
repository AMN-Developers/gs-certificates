import { certificateTokens } from '@/lib/db/schema';
import type { DB } from '@/lib/db';
import { db } from '@/lib/db';
import { OrderDTO } from '@/dtos/order';
import { UserDTO } from '@/dtos/user';
import { IOrdersRepository, IUsersRepository } from '@/repositories';
import { UsersRepository } from '@/repositories/userRepository';

export class OrdersRepository implements IOrdersRepository {
  private db: DB;
  private _userRepository: IUsersRepository;

  constructor() {
    this.db = db;
    this._userRepository = new UsersRepository();
  }

  async createOrder(order: OrderDTO) {
    const { id, tokens } = order;

    await this.db.transaction(async (db) => {
      const user = await this._userRepository.retrieveUserById(new UserDTO(id));

      if (!user || !user.userId) {
        await this._userRepository.createUserData(new UserDTO(id));
      }

      await db.insert(certificateTokens).values({
        id,
        userId: id,
        ...tokens,
      });

      await this._userRepository.updateUserCertificateToken({
        userId: id,
        certificateTokenId: id,
      });
    });

    return 'Order created successfully';
  }
}
