import { OrderDTO } from '@/dtos/order';
import { OrdersRepository } from '@/repositories/ordersRepository';
import { orderInputSchema } from '@/app/_lib/validation-shemas/order';

export async function POST(req: Request) {
  const requestBody = await req.json();
  const { data, error } = orderInputSchema.safeParse(requestBody);

  if (error) {
    return new Response(error.message, {
      status: 400,
    });
  }

  try {
    const ordersRepository = new OrdersRepository();
    await ordersRepository.createOrder(new OrderDTO(data.id, data.order_items));
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
