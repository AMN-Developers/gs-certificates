import { OrderDTO } from '@/dtos/order';
import { IOrdersRepository } from '@/repositories';

export class OrdersService {
  private _ordersRepository: IOrdersRepository;

  constructor(ordersRepository: IOrdersRepository) {
    this._ordersRepository = ordersRepository;
  }

  async createOrder(order: OrderDTO) {
    // TODO: In the future, we should add some validation and check for authorization here
    const newOrder = await this._ordersRepository.createOrder(order);
    return newOrder;
  }
}
