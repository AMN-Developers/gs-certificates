/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createServerAction } from 'zsa';
import { createCertificateSchema } from '@lib/validation-shemas/create-certificate';
import { CertificatesService } from '@/services/certificatesService';

export const createCertificate = createServerAction()
  .input(createCertificateSchema)
  .handler(async ({ input }) => {
    try {
      const certificateService = new CertificatesService();

      const certificate = await certificateService.createCertificate(input);

      return {
        message: 'Certificate created successfully',
        certificate: {
          id: certificate.id,
          certificate_token: certificate.certificate_token,
        },
      };
    } catch (error: any) {
      return {
        message: 'Error creating certificate',
        error: error.message,
      };
    }
  });
