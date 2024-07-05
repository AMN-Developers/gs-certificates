/* eslint-disable no-unused-vars */
import { OrderDTO } from '@/dtos/order';

export interface IOrdersRepository {
  createOrder(order: OrderDTO): Promise<OrderDTO>;
}
