import { OrderDTO } from '@/dtos/order';
import { orderInputSchema } from '@/app/_lib/validation-shemas/order';
import { OrdersService } from '@/services/ordersService';
import { env } from '@/utils/env';

export async function POST(req: Request) {
  const token = req.headers.get('Authorization');

  if (!token || token !== `Bearer ${env.JWT_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const requestBody = await req.json();
  const { data, error } = orderInputSchema.safeParse(requestBody);

  if (error) {
    return new Response(error.message, {
      status: 400,
    });
  }

  try {
    const ordersService = new OrdersService();

    for (const order of data) {
      const orderDTO = OrderDTO.fromDb(order);
      await ordersService.createOrder(orderDTO);
    }
  } catch (error) {
    return new Response(
      `Failed to create order ${error instanceof Error ? error.message : ''}`,
      {
        status: 500,
      },
    );
  }

  return new Response('Order created successfully', {
    status: 201,
  });
}
