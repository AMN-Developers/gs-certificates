import { CertificateDTO } from '@/dtos/certificate';
import { ICertificatesRepository } from '@/repositories';
import { CertificatesRepository } from '@/repositories/certificatesRepository';
import { generateCertificateToken } from '@/utils/generateCertificateToken';

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
    //TODO: This service should also check for authentication and authorization
    const newCertificateToken = generateCertificateToken(certificate);

    const newCertificate = await this._certificatesRepository.createCertificate(
      new CertificateDTO(newCertificateToken),
    );

    return newCertificate;
  }
}
