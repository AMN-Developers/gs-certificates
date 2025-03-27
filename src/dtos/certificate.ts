import type { TokenType } from '@/repositories/userRepository';

export type Products =
  | 'Impertudo'
  | 'Safe'
  | 'Safe Tech'
  | 'Eco'
  | 'Tech Block'
  | null;
export class CertificateDTO {
  private _tokenHash: string;
  private _encryptedData: string;
  private _issuedAt: Date;
  private _userId: number;
  private _type: TokenType;
  private _product: Products | null;

  constructor(
    tokenHash: string,
    encryptedData: string,
    issuedAt: Date,
    userId: number,
    type: TokenType,
    product: Products,
  ) {
    this._tokenHash = tokenHash;
    this._encryptedData = encryptedData;
    this._issuedAt = issuedAt;
    this._userId = userId;
    this._type = type;
    this._product = product;
  }

  get tokenHash() {
    return this._tokenHash;
  }

  get encryptedData() {
    return this._encryptedData;
  }

  get issuedAt() {
    return this._issuedAt;
  }

  get userId() {
    return this._userId;
  }

  get type() {
    return this._type;
  }

  get product() {
    return this._product;
  }

  static fromDb(data: {
    tokenHash: string;
    encryptedData: string;
    issuedAt: Date;
    userId: number;
    type: TokenType;
    product: Products;
  }) {
    return new CertificateDTO(
      data.tokenHash,
      data.encryptedData,
      data.issuedAt,
      data.userId,
      data.type,
      data.product,
    );
  }
}
