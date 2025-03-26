'use server';

import { authenticatedProcedure } from '@/lib/zsa-procedures';
import { z } from 'zod';

export const getUser = authenticatedProcedure
  .createServerAction()
  .output(
    z.object({
      id: z.number(),
      certificateTokens: z.array(
        z.object({
          type: z.string(),
          balance: z.number(),
        }),
      ),
    }),
  )
  .handler(async ({ ctx }) => {
    const { userId, certificateTokens } = ctx;

    if (!userId) {
      throw new Error('Não autorizado!');
    }

    return {
      id: userId,
      certificateTokens,
    };
  });
