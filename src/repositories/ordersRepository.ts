import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma/client';
import { OrderDTO } from '@/dtos/order';
import { IOrdersRepository } from '.';

export class OrdersRepository implements IOrdersRepository {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async createOrder(order: OrderDTO) {
    const { id, order_items } = order;

    const newOrder = await this.db.order.create({
      data: {
        id,
        order_items: {
          connectOrCreate: [
            ...order_items.map((orderItem) => {
              return {
                where: {
                  order_id_product_id: {
                    order_id: id,
                    product_id: orderItem.product_id,
                  },
                },
                create: {
                  product_id: orderItem.product_id,
                  quantity: orderItem.quantity,
                },
              };
            }),
          ],
        },
      },
      select: {
        id: true,
        order_items: true,
      },
    });

    if (!newOrder) {
      throw new Error('Order not created');
    }

    return OrderDTO.fromDb(newOrder);
  }
}
