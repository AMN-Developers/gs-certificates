import { TokenType } from '@/repositories/userRepository';

export class CertificateDTO {
  private _tokenHash: string;
  private _encryptedData: string;
  private _issuedAt: Date;
  private _userId: number;
  private _type: TokenType;

  constructor(
    tokenHash: string,
    encryptedData: string,
    issuedAt: Date,
    userId: number,
    type: TokenType,
  ) {
    this._tokenHash = tokenHash;
    this._encryptedData = encryptedData;
    this._issuedAt = issuedAt;
    this._userId = userId;
    this._type = type;
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

  static fromDb(data: {
    tokenHash: string;
    encryptedData: string;
    issuedAt: Date;
    userId: number;
    type: TokenType;
  }) {
    return new CertificateDTO(
      data.tokenHash,
      data.encryptedData,
      data.issuedAt,
      data.userId,
      data.type,
    );
  }
}
