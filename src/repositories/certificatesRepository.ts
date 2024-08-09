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
    const { tokenHash, encryptedData, issuedAt, userId } = certificate;

    if (!tokenHash || !encryptedData || !issuedAt || !userId) {
      throw new Error('Invalid certificate data');
    }

    const newCertificate = await this.db.certificate.create({
      data: {
        tokenHash,
        encryptedData,
        issuedAt,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        tokenHash: true,
        encryptedData: true,
        issuedAt: true,
      },
    });

    if (!newCertificate) {
      throw new Error('Certificate not created');
    }

    return CertificateDTO.fromDb(newCertificate);
  }

  async retrieveCertificateById(tokenHash: string) {
    const certificate = await this.db.certificate.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!certificate) {
      throw new Error('Certificate not found');
    }

    return CertificateDTO.fromDb({
      tokenHash: certificate.tokenHash,
      encryptedData: certificate.encryptedData,
      issuedAt: certificate.issuedAt,
    });
  }
}
