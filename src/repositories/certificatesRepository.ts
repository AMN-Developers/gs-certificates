import { eq } from 'drizzle-orm';
import type { DB } from '@/lib/db';
import { db } from '@/lib/db';
import { certificates } from '@/lib/db/schema';
import { CertificateDTO } from '@/dtos/certificate';
import { ICertificatesRepository } from '.';

export class CertificatesRepository implements ICertificatesRepository {
  private db: DB;

  constructor() {
    this.db = db;
  }

  async createCertificate(certificate: CertificateDTO) {
    const { tokenHash, encryptedData, issuedAt, userId } = certificate;

    const [newCertificate] = await this.db
      .insert(certificates)
      .values({
        tokenHash,
        encryptedData,
        issuedAt,
        userId,
      })
      .returning();

    return CertificateDTO.fromDb(newCertificate);
  }

  async retrieveCertificateById(tokenHash: string) {
    const [certificate] = await this.db
      .select()
      .from(certificates)
      .where(eq(certificates.tokenHash, tokenHash))
      .limit(1);

    return CertificateDTO.fromDb({
      tokenHash: certificate.tokenHash,
      encryptedData: certificate.encryptedData,
      issuedAt: certificate.issuedAt,
      userId: certificate.userId,
    });
  }
}
