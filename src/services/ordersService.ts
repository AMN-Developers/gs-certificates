import { OrderDTO } from '@/dtos/order';
import { UserDTO } from '@/dtos/user';
import { IOrdersRepository, IUsersRepository } from '@/repositories';
import { OrdersRepository } from '@/repositories/ordersRepository';
import { UsersRepository } from '@/repositories/userRepository';

export class OrdersService {
  private _ordersRepository: IOrdersRepository;
  private _usersRepository: IUsersRepository;

  constructor() {
    this._ordersRepository = new OrdersRepository();
    this._usersRepository = new UsersRepository();
  }

  async decrementTokenQuantity(order: OrderDTO) {
    const user = await this._usersRepository.retrieveUserById(
      new UserDTO(order.id),
    );

    if (!user || !user.certificateTokens) {
      throw new Error('User not found');
    }

    const updatedTokens = Object.keys(order.tokens).reduce(
      (acc, token) => ({
        ...acc,
        [token]: user.certificateTokens![token] - order.tokens[token],
      }),
      {} satisfies { [key: string]: number },
    );

    const updatedUser = await this._usersRepository.updateTokenQuantity({
      userId: order.id,
      certificateTokens: updatedTokens,
    });

    if (!updatedUser) {
      throw new Error('Token quantity not updated');
    }

    return 'Token quantity updated successfully';
  }

  async createOrder(order: OrderDTO) {
    const user = await this._usersRepository.retrieveUserById(
      new UserDTO(order.id),
    );

    if (!user || !user.certificateTokens) {
      const newOrder = await this._ordersRepository.createOrder(order);
      return newOrder;
    }

    const updatedTokens = Object.keys(order.tokens).reduce(
      (acc, token) => ({
        ...acc,
        [token]: user.certificateTokens![token] + order.tokens[token],
      }),
      {} satisfies { [key: string]: number },
    );

    const updatedUser = await this._usersRepository.updateTokenQuantity({
      userId: order.id,
      certificateTokens: updatedTokens,
    });

    if (!updatedUser) {
      throw new Error('Order not created');
    }

    return 'Order created successfully';
  }
}
