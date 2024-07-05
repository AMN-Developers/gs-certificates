import { z } from 'zod';

export const orderInputSchema = z.object({
  id: z.number(),
  order_items: z.array(
    z.object({
      product_id: z.number(),
      quantity: z.number(),
    }),
  ),
});
