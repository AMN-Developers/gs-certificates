import jwt from 'jsonwebtoken';
import { env } from './env';

export const decodeCertificateToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as {
    clientName: string;
    date: string;
    companyName: string;
    technichalResponsible: string;
  };
};
