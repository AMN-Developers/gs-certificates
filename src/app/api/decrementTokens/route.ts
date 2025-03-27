import { orderInputSchema } from '@/app/_lib/validation-shemas/order';
import { env } from '@/utils/env';
import { DecrementTokenBalanceUseCase } from '@/use-cases/decrement-token-balance.usecase';

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
    const decrementTokenUseCase = new DecrementTokenBalanceUseCase();
    const results = [];

    for (const order of data) {
      const response = await decrementTokenUseCase.execute(
        order.id,
        order.tokens,
      );
      results.push(response);
    }

    return new Response(JSON.stringify(results), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error decrementing tokens:', error);
    return new Response(
      `Failed to update tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
      {
        status: 500,
      },
    );
  }
}
