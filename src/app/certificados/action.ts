'use server';

import { authenticatedProcedure } from '@/lib/zsa-procedures';
import { z } from 'zod';

export const getUser = authenticatedProcedure
  .createServerAction()
  .output(
    z.object({
      id: z.number(),
      certificateTokens: z
        .object({
          higienizacao: z.number().optional(),
        })
        .optional(),
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
