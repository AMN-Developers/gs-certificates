/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createServerAction } from 'zsa';
import { z } from 'zod';
import { createCertificateSchema } from '@lib/validation-shemas/create-certificate';
import { CertificatesService } from '@/services/certificatesService';

export const createCertificate = createServerAction()
  .input(createCertificateSchema)
  .output(
    z.object({
      message: z.string(),
      certificateToken: z.string().optional(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const certificateService = new CertificatesService();
      const certificate = await certificateService.createCertificate(input);

      return {
        message: 'Certificate created successfully',
        certificateToken: certificate.certificateToken,
      };
    } catch (error: any) {
      console.log('error', error);
      return {
        message: 'Error creating certificate',
        error: error.message,
      };
    }
  });
