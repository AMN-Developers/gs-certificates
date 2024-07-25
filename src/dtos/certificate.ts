export class CertificateDTO {
  private _tokenHash: string;
  private _encryptedData: string;
  private _issuedAt: Date;
  private _userId: number | undefined;

  constructor(
    tokenHash: string,
    encryptedData: string,
    issuedAt: Date,
    userId?: number,
  ) {
    this._tokenHash = tokenHash;
    this._encryptedData = encryptedData;
    this._issuedAt = issuedAt;
    this._userId = userId;
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

  static fromDb(data: {
    tokenHash: string;
    encryptedData: string;
    issuedAt: Date;
    userId?: number;
  }) {
    return new CertificateDTO(
      data.tokenHash,
      data.encryptedData,
      data.issuedAt,
      data.userId,
    );
  }
}
