/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createServerAction } from 'zsa';
import { z } from 'zod';
import { CertificatesService } from '@/services/certificatesService';
import { env } from '@/utils/env';

export const retrieveCertificateById = createServerAction()
  .input(
    z.object({
      certificateId: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const certificateService = new CertificatesService();
    const certificate = await certificateService.retrieveCertificateById(
      input.certificateId,
    );

    return {
      message: 'Certificate retrieved successfully',
      certificate,
    };
  });

export const generateCertificatePDF = createServerAction()
  .input(
    z.object({
      certificateId: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { certificateId } = input;

    try {
      const response = await fetch(
        'https://html2pdf-nu.vercel.app/api/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.JWT_SECRET}`,
          },
          body: JSON.stringify({
            url: `${process.env.NEXT_PUBLIC_APP_URL}/certificados/${certificateId}/print`,
          }),
        },
      );

      const pdfBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(pdfBuffer);

      return {
        pdf: Array.from(uint8Array),
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  });
