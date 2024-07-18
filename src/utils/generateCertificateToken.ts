import jwt from 'jsonwebtoken';
import { env } from './env';

export const generateCertificateToken = (certificateData: {
  clientName: string;
  date: Date;
  companyName: string;
  technichalResponsible: string;
}) => {
  const { clientName, date, companyName, technichalResponsible } =
    certificateData;
  const isoDate = date.toISOString();

  return jwt.sign(
    {
      clientName,
      date: isoDate,
      companyName,
      technichalResponsible,
    },
    env.JWT_SECRET,
    {
      algorithm: 'HS256',
    },
  );
};
