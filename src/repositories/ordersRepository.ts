import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma/client';
import { OrderDTO } from '@/dtos/order';
import { IOrdersRepository } from '@/repositories';

export class OrdersRepository implements IOrdersRepository {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async createOrder(order: OrderDTO) {
    const { id, tokens } = order;

    await this.db.certificateTokens.create({
      data: {
        user: {
          connectOrCreate: {
            where: {
              id,
            },
            create: {
              id,
            },
          },
        },
        ...tokens,
      },
    });

    return 'Order created successfully';
  }
}
