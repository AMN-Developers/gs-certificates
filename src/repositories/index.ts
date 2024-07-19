/* eslint-disable no-unused-vars */
import { OrderDTO } from '@/dtos/order';
import { CertificateDTO } from '@/dtos/certificate';

export interface IOrdersRepository {
  createOrder(order: OrderDTO): Promise<OrderDTO>;
}

export interface ICertificatesRepository {
  createCertificate(certificate: CertificateDTO): Promise<CertificateDTO>;
  retrieveCertificateById(certificateId: string): Promise<CertificateDTO>;
}
