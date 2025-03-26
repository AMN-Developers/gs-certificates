import { CertificateDTO } from '@/dtos/certificate';
import { ICertificatesRepository, IUsersRepository } from '@/repositories';
import { CertificatesRepository } from '@/repositories/certificatesRepository';
import { TokenType, UsersRepository } from '@/repositories/userRepository';
import {
  decrypt,
  encrypt,
  generateRandomToken,
  generateTokenHash,
} from '@/utils/crypto';
import { env } from '@/utils/env';

export class CertificatesService {
  private _certificatesRepository: ICertificatesRepository;
  private _usersRepository: IUsersRepository;

  constructor() {
    this._certificatesRepository = new CertificatesRepository();
    this._usersRepository = new UsersRepository();
  }

  async createCertificate(certificate: {
    clientName: string;
    date: Date;
    companyName: string;
    technichalResponsible: string;
    userId: number;
    type: TokenType;
  }) {
    const user = await this._usersRepository.findById(certificate.userId);

    if (!user) {
      throw new Error('User not found');
    }

    const certificateTokenQuantity =
      await this._usersRepository.findTokenBalance(
        certificate.userId,
        certificate.type,
      );

    if (!certificateTokenQuantity || certificateTokenQuantity.balance < 1) {
      throw new Error('User does not have enough tokens');
    }

    await this._usersRepository.updateTokenBalance(
      certificate.userId,
      certificate.type,
      certificateTokenQuantity.balance - 1,
    );

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
        user.id,
        certificate.type,
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
