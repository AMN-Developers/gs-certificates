/* eslint-disable no-unused-vars */
import { OrderDTO } from '@/dtos/order';
import { CertificateDTO } from '@/dtos/certificate';
import { UserDTO } from '@/dtos/user';

export interface IOrdersRepository {
  createOrder(order: OrderDTO): Promise<string>;
}

export interface ICertificatesRepository {
  createCertificate(certificate: CertificateDTO): Promise<CertificateDTO>;
  retrieveCertificateById(certificateId: string): Promise<CertificateDTO>;
}

export interface IUsersRepository {
  createUserData(userData: UserDTO): Promise<UserDTO>;
  retrieveUserById(userData: UserDTO): Promise<UserDTO>;
  updateUserCertificateToken(userData: {
    userId: number;
    certificateTokenId: number;
  }): Promise<UserDTO>;
  updateTokenQuantity(userData: {
    userId: number;
    certificateTokens: { [key: string]: number };
  }): Promise<UserDTO>;
}
