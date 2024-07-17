import { z } from 'zod';

export const createCertificateSchema = z.object({
  clientName: z.string().min(3),
  date: z.date({
    required_error: 'Data é obrigatória',
  }),
  companyName: z.string().min(3),
  technichalResponsible: z.string().min(3),
});
