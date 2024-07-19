export class CertificateDTO {
  private _tokenHash: string;
  private _encryptedData: string;
  private _issuedAt: Date;

  constructor(tokenHash: string, encryptedData: string, issuedAt: Date) {
    this._tokenHash = tokenHash;
    this._encryptedData = encryptedData;
    this._issuedAt = issuedAt;
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

  static fromDb(data: {
    tokenHash: string;
    encryptedData: string;
    issuedAt: Date;
  }) {
    return new CertificateDTO(
      data.tokenHash,
      data.encryptedData,
      data.issuedAt,
    );
  }
}
