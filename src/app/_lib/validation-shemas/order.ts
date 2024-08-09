import { z } from 'zod';

export const orderInputSchema = z.array(
  z.object({
    id: z.number(),
    tokens: z.object({
      higienizacao: z.number(),
    }),
  }),
);
