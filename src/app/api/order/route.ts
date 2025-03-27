import { env } from '@/utils/env';
import { UpsertTokenBalanceUseCase } from '@/use-cases/token-balance.usecase';
import { orderInputSchema } from '@/app/_lib/validation-shemas/order';

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
    const upsertTokenBalanceUseCase = new UpsertTokenBalanceUseCase();
    const results = [];

    for (const order of data) {
      const response = await upsertTokenBalanceUseCase.execute(
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
    return new Response(
      `Failed to create order ${error instanceof Error ? error.message : ''}`,
      {
        status: 500,
      },
    );
  }
}
