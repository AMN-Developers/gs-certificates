/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createServerAction } from 'zsa';
import puppeteer from 'puppeteer';
import { z } from 'zod';
import { CertificatesService } from '@/services/certificatesService';

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
      const browser = await puppeteer.launch({
        headless: true,
      });

      const page = await browser.newPage();

      await page.setViewport({
        width: Math.floor((297 * 96) / 25.4),
        height: Math.floor((210 * 96) / 25.4),
        deviceScaleFactor: 2,
      });

      await page.goto(
        `${process.env.NEXT_PUBLIC_APP_URL}/certificados/${certificateId}/print`,
        {
          waitUntil: 'networkidle0',
        },
      );

      // return pdf buffer
      const pdf = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
      });

      await browser.close();

      return {
        pdf: Array.from(pdf),
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  });
