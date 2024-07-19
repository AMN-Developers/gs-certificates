/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createServerAction } from 'zsa';
import { z } from 'zod';
import { CertificatesService } from '@/services/certificatesService';

export const retrieveCertificateById = createServerAction()
  .input(
    z.object({
      certificateId: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const certificateService = new CertificatesService();
      const certificate = await certificateService.retrieveCertificateById(
        input.certificateId,
      );
      return {
        message: 'Certificate retrieved successfully',
        certificate,
      };
    } catch (error: any) {
      return {
        message: 'Error retrieving certificate',
        error: error.message,
      };
    }
  });
