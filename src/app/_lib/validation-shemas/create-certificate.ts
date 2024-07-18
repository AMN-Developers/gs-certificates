import { z } from 'zod';

export const createCertificateSchema = z.object({
  clientName: z
    .string({
      required_error: 'Nome do cliente é obrigatório',
      invalid_type_error: 'Nome do cliente deve ser uma string',
      description: 'Nome do cliente',
    })
    .min(3),
  date: z.date({
    required_error: 'Data é obrigatória',
    invalid_type_error: 'Data deve ser uma data',
    description: 'Data de emissão do certificado',
  }),
  companyName: z
    .string({
      required_error: 'Nome da empresa é obrigatório',
      invalid_type_error: 'Nome da empresa deve ser uma string',
      description: 'Nome da empresa',
    })
    .min(3),
  technichalResponsible: z
    .string({
      required_error: 'Responsável técnico é obrigatório',
      invalid_type_error: 'Responsável técnico deve ser uma string',
      description: 'Nome do responsável técnico',
    })
    .min(3),
});
