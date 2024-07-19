/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { authenticatedProcedure } from '@/lib/zsa-procedures';
import { z } from 'zod';
import { createCertificateSchema } from '@lib/validation-shemas/create-certificate';
import { CertificatesService } from '@/services/certificatesService';

export const createCertificate = authenticatedProcedure
  .createServerAction()
  .input(createCertificateSchema)
  .output(
    z.object({
      message: z.string(),
      certificateToken: z.string().optional(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new Error('Não autorizado!');
    }

    const certificateService = new CertificatesService();
    const certificate = await certificateService.createCertificate(input);

    return {
      message: 'Certificado criado com sucesso!',
      certificateToken: certificate.certificateToken,
    };
  });
