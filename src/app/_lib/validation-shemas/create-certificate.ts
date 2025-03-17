import { z } from 'zod';

export const createCertificateSchema = z.object({
  clientName: z
    .string({
      required_error: 'Nome do cliente é obrigatório',
      invalid_type_error: 'Nome do cliente deve ser uma string',
      description: 'Nome do cliente',
    })
    .min(3, { message: 'Nome do cliente deve ter pelo menos 3 caracteres' }),
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
    .min(3, { message: 'Nome da empresa deve ter pelo menos 3 caracteres' }),
  technichalResponsible: z
    .string({
      required_error: 'Técnico aplicador é obrigatório',
      invalid_type_error: 'Técnico aplicador deve ser uma string',
      description: 'Nome do técnico aplicador',
    })
    .min(3, {
      message: 'Técnico aplicador deve ter pelo menos 3 caracteres',
    }),
});
