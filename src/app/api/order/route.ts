import prisma from '@/utils/prisma/client';
import { ProductInOrder } from '@prisma/client';

interface ICreateOrder {
  id: number;
  order_items: OrderItem[];
}

type OrderItem = Pick<ProductInOrder, 'order_id' | 'quantity' | 'product_id'>;

export async function POST(req: Request) {
  const requestBody: ICreateOrder = await req.json();

  const order = await prisma.order.create({
    data: {
      id: requestBody.id,
      order_items: {
        connectOrCreate: [
          ...requestBody.order_items.map((orderItem) => {
            return {
              where: {
                order_id_product_id: {
                  order_id: requestBody.id,
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
  });

  return Response.json({ message: 'Order created', order });
}
