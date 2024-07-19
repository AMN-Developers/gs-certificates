import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma/client';
import { CertificateDTO } from '@/dtos/certificate';
import { ICertificatesRepository } from '.';

export class CertificatesRepository implements ICertificatesRepository {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async createCertificate(certificate: CertificateDTO) {
    const { certificate_token } = certificate;

    //TODO: In the future, this should be connected to the user that is creating the certificate
    const newCertificate = await this.db.certificate.create({
      data: {
        certificate_token,
        user: {
          connect: {
            id: 1,
          },
        },
      },
      select: {
        id: true,
        certificate_token: true,
      },
    });

    if (!newCertificate) {
      throw new Error('Certificate not created');
    }

    return CertificateDTO.fromDb({
      certificate_token: newCertificate.certificate_token,
      id: newCertificate.id,
    });
  }

  async retrieveCertificateById(id: string) {
    const certificate = await this.db.certificate.findUnique({
      where: {
        id,
      },
    });

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    return CertificateDTO.fromDb({
      certificate_token: certificate.certificate_token,
      id: certificate.id,
    });
  }
}
