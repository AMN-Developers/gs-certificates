import { CertificateDTO } from '@/dtos/certificate';
import { ICertificatesRepository } from '@/repositories';
import { CertificatesRepository } from '@/repositories/certificatesRepository';
import {
  decrypt,
  encrypt,
  generateRandomToken,
  generateTokenHash,
} from '@/utils/crypto';
import { env } from '@/utils/env';

export class CertificatesService {
  private _certificatesRepository: ICertificatesRepository;

  constructor() {
    this._certificatesRepository = new CertificatesRepository();
  }

  async createCertificate(certificate: {
    clientName: string;
    date: Date;
    companyName: string;
    technichalResponsible: string;
  }) {
    const encryptCertificateData = encrypt(
      JSON.stringify(certificate),
      env.JWT_SECRET,
    );

    const encryptedCertificateToken = generateRandomToken();

    const encryptedTokenHash = generateTokenHash(encryptedCertificateToken);

    await this._certificatesRepository.createCertificate(
      new CertificateDTO(
        encryptedTokenHash,
        encryptCertificateData,
        certificate.date,
      ),
    );

    return {
      certificateToken: encryptedCertificateToken,
    };
  }

  async retrieveCertificateById(certificateId: string) {
    const encryptedTokenHash = generateTokenHash(certificateId);

    const certificate =
      await this._certificatesRepository.retrieveCertificateById(
        encryptedTokenHash,
      );

    if (!certificate) {
      throw new Error('Certificate not found');
    }
    let decryptedData: {
      clientName: string;
      date: Date;
      companyName: string;
      technichalResponsible: string;
    };
    try {
      decryptedData = JSON.parse(
        decrypt(certificate.encryptedData, env.JWT_SECRET),
      );
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw new Error('Failed to decrypt certificate data');
    }

    return decryptedData;
  }
}
