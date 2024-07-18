'use sever';

import { createServerAction } from 'zsa';
import { z } from 'zod';
import { createCertificateSchema } from '@lib/validation-shemas/create-certificate';

export const createCertificate = createServerAction()
  .input(createCertificateSchema)
  .output(
    z.object({
      message: z.string(),
      certificate: z.object({
        id: z.string(),
        clientName: z.string(),
        date: z.date(),
        companyName: z.string(),
        technichalResponsible: z.string(),
      }),
    }),
  )
  .handler(async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      message: 'Certificado criado com sucesso',
      certificate: {
        id: '1',
        ...input,
      },
    };
  });
